using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class PostController : ControllerBase
{
    private readonly IPostRepository _postRepository;

    public PostController(IPostRepository postRepository)
    {
        _postRepository = postRepository;
    }

    [HttpPost]
    public async Task<ActionResult<Post>> CreatePost(CreatePostDto dto)
    {
        var userId = User.GetUserId();

        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var post = new Post
        {
            UserId = userId,
            Caption = dto.Caption
        };

        await _postRepository.CreateAsync(post);

        return Ok(post);
    }

    [HttpGet]
    public async Task<ActionResult<List<Post>>> GetPosts()
    {
        var posts = await _postRepository.GetAllAsync();
        return Ok(posts);
    }

    [HttpGet("user/{userId}")]
    public async Task<ActionResult<List<Post>>> GetUserPosts(string userId)
    {
        var posts = await _postRepository.GetByUserIdAsync(userId);
        return Ok(posts);
    }
}