namespace api.Interfaces;

public interface ITokenService
{
    public Task<string> CreateToken(AppUser appUser);

    Task<ObjectId?> GetActualUserId(string? userIdHashed, CancellationToken cancellationToken);

}