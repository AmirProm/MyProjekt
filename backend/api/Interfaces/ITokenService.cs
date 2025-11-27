namespace api.Interfaces;

public interface ITokenService
{
    public Task<string> CreateToken(AppUser appUser);
}