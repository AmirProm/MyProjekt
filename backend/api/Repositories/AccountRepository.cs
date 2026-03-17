using api.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace api.Repositories;

[AllowAnonymous]
public class AccountRepository : IAccountRepository
{

    #region Mongodb
    private readonly IMongoCollection<AppUser> _collection;
    private readonly ITokenService _tokenService;
    private readonly UserManager<AppUser> _userManager;

    // Dependency Injection
    public AccountRepository(IMongoClient client, IMyMongoDbSettings dbSettings, ITokenService tokenService, UserManager<AppUser> userManager)
    {
        var dbName = client.GetDatabase(dbSettings.DatabaseName);
        _collection = dbName.GetCollection<AppUser>("users");
        _userManager = userManager;
        _tokenService = tokenService;
    }
    #endregion

    public async Task<OperationResult<LoggedInDto>> RegisterAsync(RegisterDto userInput, CancellationToken cancellationToken)
    {
        var appUser = Mappers.ConvertRegisterDtoToAppUser(userInput);

        IdentityResult userCreationResult = await _userManager.CreateAsync(appUser, userInput.Password);

        if (!userCreationResult.Succeeded)
        {
            var errors = userCreationResult.Errors
                .Select(e => e.Description)
                .ToList();

            return new OperationResult<LoggedInDto>
            (
                IsSucces: false,
                Error: new CustomError(
                    ErrorCode.NetIdentityFailed,
                    "User creation failed!"
                )
            );
        }

        IdentityResult roleResult = await _userManager.AddToRoleAsync(appUser, "member");

        if (!roleResult.Succeeded)
        {
            var roleErrors = roleResult.Errors
                .Select(e => e.Description)
                .ToList();

            return new OperationResult<LoggedInDto>
            (
                IsSucces: false,
                Error : new CustomError(
                ErrorCode.NetIdentityRoleFailed,
                "Add role to user failed!"
                )
            );
        }

        var token = await _tokenService.CreateToken(appUser);

        if (string.IsNullOrEmpty(token))
        {
            return new OperationResult<LoggedInDto>
            (
                 IsSucces: false,
                Error : new CustomError(
                ErrorCode.IsTokenFailed,
                "Token creditoin failded!"
                )
            );
        }

        LoggedInDto loggedInDto =Mappers.ConvertAppUserToLoggedInDto(appUser, token);

        return new OperationResult<LoggedInDto>(
            IsSucces: true,
            Result: loggedInDto,
            null
        );

    }


    public async Task<LoggedInDto?> LoginAsync(LoginDto userInput, CancellationToken cancellationToken)
    {
        AppUser? appUser = await _userManager.FindByEmailAsync(userInput.Email);

        if (appUser is null)
        {
            return new LoggedInDto
            {
                IsWrongCreds = true,
            };
        }

        bool isPassCorrect = await _userManager.CheckPasswordAsync(appUser, userInput.Password);

        if (!isPassCorrect)
        {
            return new LoggedInDto
            {
                IsWrongCreds = true
            };
        }

        string? token = await _tokenService.CreateToken(appUser);

        if (string.IsNullOrEmpty(token))
        {
            return null;
        }

        return Mappers.ConvertAppUserToLoggedInDto(appUser, token);
    }

    [Authorize]
    public async Task<DeleteResult?> DeleteByIdAsync(string userId, CancellationToken cancellationToken)
    {
        AppUser appUser = await _collection.Find<AppUser>(doc => doc.Id.ToString() == userId).FirstOrDefaultAsync(cancellationToken);

        if (appUser is null)
        {
            return null;
        }

        return await _collection.DeleteOneAsync<AppUser>(doc => doc.Id.ToString() == userId, cancellationToken);
    }

    public async Task<LoggedInDto?> ReloadLoggedInUserAsync(string userId, string token, CancellationToken cancellationToken)
    {
        AppUser? appUser = await _collection.Find<AppUser>(doc => doc.Id.ToString() == userId).FirstOrDefaultAsync(cancellationToken);

        if (appUser is null)
            return null;

        return Mappers.ConvertAppUserToLoggedInDto(appUser, token);
    }

    public async Task<UpdateResult?> UpdateLastActive(string userId, CancellationToken cancellationToken)
    {
        if (userId is null) return null;

        UpdateDefinition<AppUser> updateUserLastActive = Builders<AppUser>.Update.
            Set(appUser => appUser.LastActive, DateTime.UtcNow);

        return await _collection.UpdateOneAsync(doc => doc.Id.ToString() == userId, updateUserLastActive, null, cancellationToken);
    }
}