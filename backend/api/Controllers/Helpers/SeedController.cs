using Microsoft.AspNetCore.Identity;

namespace api.Controllers;

public class SeedController : BaseApiController
{
    #region Db Settings
    private readonly IMongoDatabase _database;
    private readonly IMongoClient _client;
    private readonly UserManager<AppUser> _userManager;
    private readonly RoleManager<AppRole> _roleManager;

    public SeedController(IMongoClient client, IMyMongoDbSettings dbSettings, UserManager<AppUser> userManager, RoleManager<AppRole> roleManager)
    {
        _client = client;
        _database = client.GetDatabase(dbSettings.DatabaseName);

        _userManager = userManager;
        _roleManager = roleManager;
    }
    #endregion

    // Add Roles, Admin, and Moderator to DB
    [HttpPost]
    public async Task<ActionResult> CreateDummyMembers()
    {
        #region If databaseExists
        // Stop if database already exists using its status
        // https://stackoverflow.com/a/53803908/3944285
        var command = "{ dbStats: 1, scale: 1 }";
        var dbStats = await _database.RunCommandAsync<BsonDocument>(command);
        bool databaseExists;

        if (dbStats["collections"].BsonType == BsonType.Int64)
        {
            var collectionsCount = dbStats["collections"].AsInt64;
            databaseExists = collectionsCount > 0 || dbStats["indexes"].AsInt64 > 0;
        }
        else
        {
            var collectionsCount = dbStats["collections"].AsInt32;
            databaseExists = collectionsCount > 0 || dbStats["indexes"].AsInt32 > 0;
        }

        if (databaseExists == true)
            // return BadRequest("Database already exists");
            await _client.DropDatabaseAsync("match-finder");
        // await _database.DropCollectionAsync(_collectionName);
        #endregion If databaseExists

        #region Create Roles
        await _roleManager.CreateAsync(new AppRole { Name = "admin" });
        await _roleManager.CreateAsync(new AppRole { Name = "moderator" });
        await _roleManager.CreateAsync(new AppRole { Name = "member" });
        #endregion

        #region Create Admin and Moderator
        // Admin
        AppUser admin = new()
        {
            UserName = "admin",
            Email = "admin@a.com"
        };

        await _userManager.CreateAsync(admin, "Aaaaaaaa/"); // Create admin
        await _userManager.AddToRolesAsync(admin, ["admin", "moderator"]); // Add admin to two roles of "admin" and "moderator"

        // Moderator
        AppUser moderator = new()
        {
            Email = "moderator@a.com",
            UserName = "moderator"
        };

        await _userManager.CreateAsync(moderator, "Aaaaaaaa/"); // Create moderator
        await _userManager.AddToRoleAsync(moderator, "moderator"); // Add moderator to a role of "moderator"

        #endregion Create Admin and Moderator

        return Ok("Operation is completed. DO NOT FORGET TO CHANGE ADMIn'S PASSWORD!!!");
    }
}
