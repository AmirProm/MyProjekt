
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

    public async Task<PagedList<AppUser>> GetAllAsync(PaginationParams paginationParams, CancellationToken cancellationToken)
    {
        IQueryable<AppUser> query = _collection.AsQueryable();

        PagedList<AppUser> appUsers = await PagedList<AppUser>.CreatePagedListAsync(
            query, paginationParams.PageNumber, paginationParams.PageSize, cancellationToken
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
}
