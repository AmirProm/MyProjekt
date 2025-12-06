using api.Services;
using Image_Processing_WwwRoot.Interfaces;
using Image_Processing_WwwRoot.Services;

namespace api.Extensions;

public static class RepositoryServiceExtensions
{
    public static IServiceCollection AddRepositoryService(this IServiceCollection services)
    {
        services.AddScoped<IAccountRepository, AccountRepository>(); // Dependency Injection
        services.AddScoped<IMemberRepository, MemberRepository>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IChatRepository, ChatRepository>();
        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<IPhotoModifySaveService, PhotoModifySaveService>();
        services.AddScoped<IPhotoService, PhotoService>();
        services.AddScoped<IAdminRepository, AdminRepository>();
        
        return services;
    }
}
