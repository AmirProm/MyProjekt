
using Microsoft.AspNetCore.Identity;

namespace api.Repositories;

public class AdminRepository : IAdminRepository
{
    #region Db and user manager settings
    private readonly IMongoCollection<AppUser>? _collection;
    private readonly UserManager<AppUser> _userManager;

    // constructor - dependency injection
    public AdminRepository(IMongoClient client, IMyMongoDbSettings dbSettings, UserManager<AppUser> userManager, ITokenService tokenService)
    {
        var database = client.GetDatabase(dbSettings.DatabaseName);
        _collection = database.GetCollection<AppUser>("users");

        _userManager = userManager;
    }
    #endregion

    public async Task<IEnumerable<UserWithRoleDto>> GetUsersWithRolesAsync()
    {
        List<UserWithRoleDto> userWithRoleDtos = [];

        IEnumerable<AppUser> appUsers = _userManager.Users;

        foreach (AppUser appUser in appUsers)
        {
            IEnumerable<string> roles = await _userManager.GetRolesAsync(appUser);

            userWithRoleDtos.Add(
                new UserWithRoleDto(
                    UserName: appUser.UserName!,
                    Roles: roles
                )
            );
        }

        return userWithRoleDtos;
    }

    public async Task<DeleteResult?> DeleteUserAsync(string targetUserName, CancellationToken cancellationToken)
    {
        AppUser appUser = await _collection.Find(user => user.NormalizedUserName == targetUserName.ToUpper()).FirstOrDefaultAsync();

        if (appUser is null) return null;

        return await _collection.DeleteOneAsync(doc => doc.Id == appUser.Id, cancellationToken); 
    }
}