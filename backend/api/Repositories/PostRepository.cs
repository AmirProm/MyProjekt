using MongoDB.Driver;

public class PostRepository : IPostRepository
{
    private readonly IMongoCollection<Post> _posts;

    public PostRepository(IMongoClient client, IMyMongoDbSettings dbSettings)
    {
        var dbName = client.GetDatabase(dbSettings.DatabaseName);
        _posts = dbName.GetCollection<Post>("Posts");
    }

    public async Task<Post> CreateAsync(Post post)
    {
        await _posts.InsertOneAsync(post);
        return post;
    }

    public async Task<List<Post>> GetAllAsync()
    {
        return await _posts
            .Find(_ => true)
            .SortByDescending(x => x.CreatedAt)
            .ToListAsync();
    }

    public async Task<List<Post>> GetByUserIdAsync(string userId)
    {
        return await _posts
            .Find(x => x.UserId == userId)
            .SortByDescending(x => x.CreatedAt)
            .ToListAsync();
    }
}