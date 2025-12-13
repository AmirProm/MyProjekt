using API.Entities;

namespace API.Interfaces;

public interface IPostRepository
{
    Task<Post> CreateAsync(Post post);
    Task<Post?> GetByIdAsync(string id);
    Task<IReadOnlyList<Post>> GetFeedAsync(int pageNumber, int pageSize);
    Task<IReadOnlyList<Post>> GetByUserNameAsync(string userName, int pageNumber, int pageSize);
    Task<bool> UpdateCaptionAsync(string id, string userName, string caption);
    Task<bool> DeleteAsync(string id, string userName);
}
