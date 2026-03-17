
namespace api.Repositories;

public class FollowRepository : IFollowRepository
{
    #region Db and vars
    private readonly IMongoClient _client; // used for Session
    private readonly IMongoCollection<Follow> _collection;
    private readonly IMongoCollection<AppUser> _collectionUsers;
    private readonly IUserRepository _userRepository;
    private readonly ITokenService _tokenService;
    private readonly ILogger<FollowRepository> _logger;

    // constructor - dependency injections
    public FollowRepository(
        IMongoClient client, IMyMongoDbSettings dbSettings, IUserRepository userRepository, ITokenService tokenService, ILogger<FollowRepository> logger
        )
    {
        _client = client; // used for Session
        var dbName = client.GetDatabase(dbSettings.DatabaseName);
        _collection = dbName.GetCollection<Follow>(AppVariablesExtensions.collectionFollows);
        _collectionUsers = dbName.GetCollection<AppUser>(AppVariablesExtensions.collectionUsers);

        _tokenService = tokenService;
        _userRepository = userRepository;

        _logger = logger;
    }
    #endregion

    public async Task<FolowStatus> AddFollowAsync(string? userIdHashed, string followedMemberEmail, CancellationToken cancellationToken)
    {
        FolowStatus followStatus = new();

        if (string.IsNullOrEmpty(userIdHashed)) return followStatus;

        ObjectId? userId = await _tokenService.GetActualUserId(userIdHashed, cancellationToken);
        if (!userId.HasValue || userId.Value.Equals(ObjectId.Empty)) return followStatus;

        ObjectId? followedId = await _userRepository.GetIdByUserNameAsync(followedMemberEmail, cancellationToken);

        if (followedId.Equals(ObjectId.Empty))
            return followStatus;

        if (userId == followedId)
        {
            followStatus.IsFollowingThemself = true;
            return followStatus;
        }

        bool IsAlreadyFollowed = await _collection.Find<Follow>(follow =>
        follow.FollowerId == userId && follow.FollowedMemberId == followedId).AnyAsync(cancellationToken);

        if (IsAlreadyFollowed)
        {
            followStatus.IsAlreadyFollowed = true;
            return followStatus;
        }

        Follow? follow = Mappers.ConvertAppUsertoFollow(userId, followedId);

        if (follow is not null)
        {
            bool isSuccess = await SaveInDbWithSessionAsync(follow, userId, followedId, cancellationToken);

            followStatus.IsSuccess = isSuccess;
        }

        return followStatus; // Faild for any other reason
    }

    public async Task<PagedList<AppUser>?> GetFollowMembersAsync(string userIdHashed, FollowParams followParams, CancellationToken cancellationToken)
    {
        ObjectId? userId = await _tokenService.GetActualUserId(userIdHashed, cancellationToken);

        if (userId.Value.Equals(ObjectId.Empty) || !userId.HasValue) return null;

        followParams.UserId = userId;

        return await GetAllFollowsFromDBAsync(followParams, cancellationToken);
    }

    /// <summary>
    /// InsertOneAsync the 'follow'.
    /// Increase Member's FollowdCount by 1.
    /// Use MongoDb Transaction/Session to rollback if Update Member fails.
    /// </summary>
    /// <param name="follow"></param>
    /// <param name="followedId"></param>
    /// <param name="cancellationToken"></param>
    /// <returns>bool isSuccess</returns>
    private async Task<bool> SaveInDbWithSessionAsync(Follow follow, ObjectId? userId, ObjectId? followedId, CancellationToken cancellationToken)
    {
        //// Session is NOT supported in MongoDb Standalone servers!
        // Create a session object that is used when leveraging transactions
        using var session = await _client.StartSessionAsync(null, cancellationToken);

        // Begin transaction
        session.StartTransaction();

        try
        {
            // added session to this part so if UpdateFollowedByCount failed, undo the InsertOnce.
            await _collection.InsertOneAsync(session, follow, null, cancellationToken);

            await UpdateFollowingsCount(session, userId, cancellationToken);

            await UpdateFollowersCount(session, followedId, cancellationToken);

            await session.CommitTransactionAsync(cancellationToken);

            return true;
        }
        catch (Exception ex)
        {
            await session.AbortTransactionAsync(cancellationToken);

            _logger.LogError("Follow failed. Error writing to MongoDB" + ex.Message);

            return false;
        }
    }

    /// <summary>
    /// Get loggedInUserId and return all follower or followed appUsers from DB
    /// </summary>
    /// <param name="loggedInUserId"></param>
    /// <param name="cancellationToken"></param>
    /// <returns>appUsers</returns>
    private async Task<PagedList<AppUser>> GetAllFollowsFromDBAsync(FollowParams followParams, CancellationToken cancellationToken)
    {
        if (followParams.Predicate.Equals("followings"))
        {
            var query = _collection.AsQueryable<Follow>()
                        .Where(follow => follow.FollowerId == followParams.UserId) // filter by Lisa's id
                        .Join(_collectionUsers.AsQueryable<AppUser>(), // get follows list which are followed by the followerId/loggedInUserId
                            follow => follow.FollowedMemberId, // map each followedId user with their AppUser Id bellow
                            appUser => appUser.Id,
                            (follow, appUser) => appUser); // project the AppUser

            return await PagedList<AppUser>.CreatePagedListAsync(query, followParams.PageNumber, followParams.PageSize, cancellationToken);
        }
        else //(followParams.Predicate.Equals("followers"))
        {
            var query = _collection.AsQueryable<Follow>()
                .Where(follow => follow.FollowedMemberId == followParams.UserId)
                .Join(_collectionUsers.AsQueryable<AppUser>(),
                    follow => follow.FollowerId,
                    appUser => appUser.Id,
                    (follow, appUser) => appUser);

            return await PagedList<AppUser>.CreatePagedListAsync(query, followParams.PageNumber, followParams.PageSize, cancellationToken);
        }
    }

    /// <summary>
    /// Increament FollowingsCount of the member who followed another member. (Follower member)
    /// This is part of a MondoDb session. MongoDb will undo Insert and Update if any fails. So we don't need to verify the completion of the db process.
    /// </summary>
    /// <param name="followerId"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    private async Task UpdateFollowingsCount(IClientSessionHandle session, ObjectId? followerId, CancellationToken cancellationToken)
    {
        UpdateDefinition<AppUser> updateFollowedByCount = Builders<AppUser>.Update
        .Inc(appUser => appUser.FollowingsCount, 1); // Increament by 1 for each follow

        await _collectionUsers.UpdateOneAsync<AppUser>(session, appUser =>
                appUser.Id == followerId, updateFollowedByCount, null, cancellationToken);
    }

    /// <summary>
    /// Increament FollowersCount of the member who was followed. (TargetMember)
    /// This is part of a MondoDb session. MongoDb will undo Insert and Update if any fails. So we don't need to verify the completion of the db process.
    /// </summary>
    /// <param name="followedId"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    private async Task UpdateFollowersCount(IClientSessionHandle session, ObjectId? followedId, CancellationToken cancellationToken)
    {
        UpdateDefinition<AppUser> updateFollowerCount = Builders<AppUser>.Update
        .Inc(appUser => appUser.FollowersCount, 1); // Increament by 1 for each follow

        await _collectionUsers.UpdateOneAsync<AppUser>(session, appUser =>
                appUser.Id == followedId, updateFollowerCount, null, cancellationToken);
    }
}
