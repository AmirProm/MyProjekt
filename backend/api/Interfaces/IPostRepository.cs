namespace api.Interfaces;

public interface IPostRepository
{
    Task<Post> CreateAsync(Post post);

    Task<List<Post>> GetAllAsync();

    Task<List<Post>> GetByUserIdAsync(string userId);
}