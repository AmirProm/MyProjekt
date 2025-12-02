namespace api.Interfaces;

public interface IAdminRepository
{
    public Task<IEnumerable<UserWithRoleDto>> GetUsersWithRolesAsync();
    public Task<DeleteResult?> DeleteUserAsync(string targetUserName, CancellationToken cancellationToken);
}