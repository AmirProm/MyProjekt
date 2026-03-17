
using api.Helpers;

namespace api.Repositories;

public class MemberRepository : IMemberRepository
{
    private readonly IMongoCollection<AppUser> _collection;

    // Dependency Injection
    public MemberRepository(IMongoClient client, IMyMongoDbSettings dbSettings)
    {
        var dbName = client.GetDatabase(dbSettings.DatabaseName);
        _collection = dbName.GetCollection<AppUser>("users");
    }

    public async Task<PagedList<AppUser>> GetAllAsync(MemberParams memberParams, CancellationToken cancellationToken)
    {
        PagedList<AppUser> appUsers = await PagedList<AppUser>.CreatePagedListAsync(
            CreateQuery(memberParams), memberParams.PageNumber, memberParams.PageSize, cancellationToken
        );

        return appUsers;
    }


    public async Task<MemberDto?> GetByUserNameAsync(string userName, CancellationToken cancellationToken)
    {
        AppUser? appUser = await _collection.Find
            (doc => doc.UserName == userName).FirstOrDefaultAsync(cancellationToken);

        if (appUser is null)
            return null;

        MemberDto memberDto = Mappers.ConvertAppUserToMemberDto(appUser);

        // MemberDto memberDto = Mappers.ConvertAppUserToMemberDto(appUser);

        return memberDto;
    }

    private IQueryable<AppUser> CreateQuery(MemberParams memberParams)
    {
        // calculate DOB based on user's selected Age
        DateOnly minDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-memberParams.MaxAge - 1));
        DateOnly maxDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-memberParams.MinAge));

        IQueryable<AppUser> query = _collection.AsQueryable();

        query = memberParams.OrderBy switch
        {
            "age" => query.OrderBy(appUser => appUser.DateOfBirth).ThenBy(appUser => appUser.Id),
            "created" => query.OrderByDescending(appUser => appUser.CreatedOn).ThenBy(appUser => appUser.Id),
            _ => query.OrderByDescending(appUser => appUser.LastActive).ThenBy(appUser => appUser.Id)
        };

        if (!string.IsNullOrEmpty(memberParams.Search))
        {
            memberParams.Search = memberParams.Search.ToUpper();

            query = query.Where(
                u => u.NormalizedUserName.Contains(memberParams.Search, StringComparison.CurrentCultureIgnoreCase)
                     || u.City.Contains(memberParams.Search, StringComparison.CurrentCultureIgnoreCase)
                     || u.Country.Contains(memberParams.Search, StringComparison.CurrentCultureIgnoreCase)
                     || u.Gender.Contains(memberParams.Search, StringComparison.CurrentCultureIgnoreCase)
                     || u.Interests.Contains(memberParams.Search, StringComparison.CurrentCultureIgnoreCase)
            );
        }

        query = query.Where(u => !(u.NormalizedUserName!.Equals("ADMIN") || u.NormalizedUserName == "MODERATOR"));
        query = query.Where(u => u.Id.ToString() != memberParams.UserId);
        query = query.Where(u => u.DateOfBirth >= minDob && u.DateOfBirth <= maxDob);

        return query;
    }
}
