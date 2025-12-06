using System.Text;
using api.Helpers;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

namespace api.Extensions;

public static class ApplicationServiceExtensions
{
    public static IServiceCollection AddApplicationService(this IServiceCollection services, IConfiguration configuration)
    {
        #region MongoDbSettings
        ///// get values from this file: appsettings.vc.json /////
        // get section
        services.Configure<MyMongoDbSettings>(configuration.GetSection(nameof(MyMongoDbSettings)));

        // get values
        services.AddSingleton<IMyMongoDbSettings>(serviceProvider =>
            serviceProvider.GetRequiredService<IOptions<MyMongoDbSettings>>().Value);

        // get connectionString to the dbTest.ShowName();

        services.AddSingleton<IMongoClient>(serviceProvider =>
        {
            MyMongoDbSettings uri = serviceProvider.GetRequiredService<IOptions<MyMongoDbSettings>>().Value;

            return new MongoClient(uri.ConnectionString);
        });
        #endregion MongoDbSettings

        #region Cors: baraye ta'eede Angular HttpClient requests
        services.AddCors(options =>
            {
                options.AddDefaultPolicy(policy =>
                    policy.AllowAnyHeader().AllowAnyMethod().AllowCredentials() .WithOrigins("http://localhost:4200"));
            });
        #endregion Cors

        #region Other

        services.AddScoped<LogUserActivity>(); // monitor/log userActivity

        #endregion Other

        return services;
    }
}
