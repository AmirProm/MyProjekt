using System.Security.Claims;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PostsController : ControllerBase
{
    private readonly IPostRepository _repo;

    public PostsController(IPostRepository repo)
    {
        _repo = repo;
    }

    [HttpGet("feed")]
    public async Task<ActionResult<IReadOnlyList<PostDto>>> GetFeed([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {
        var posts = await _repo.GetFeedAsync(pageNumber, pageSize);
        return Ok(posts.Select(ToDto));
    }

    [HttpGet("user/{userName}")]
    public async Task<ActionResult<IReadOnlyList<PostDto>>> GetByUser(string userName, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {
        var posts = await _repo.GetByUserNameAsync(userName, pageNumber, pageSize);
        return Ok(posts.Select(ToDto));
    }

  
    [HttpPost]
    public async Task<ActionResult<PostDto>> Create(CreatePostDto dto)
    {
        var userName = User.FindFirstValue(ClaimTypes.Name) ?? User.FindFirstValue("unique_name");
        if (string.IsNullOrWhiteSpace(userName)) return Unauthorized();

        var post = new Post
        {
            UserName = userName,
            Caption = dto.Caption ?? "",
            PhotoUrl = dto.PhotoUrl ?? ""
        };

        var created = await _repo.CreateAsync(post);
        return Ok(ToDto(created));
    }

    
    [HttpPut("{id}")]
    public async Task<ActionResult> Update(string id, UpdatePostDto dto)
    {
        var userName = User.FindFirstValue(ClaimTypes.Name) ?? User.FindFirstValue("unique_name");
        if (string.IsNullOrWhiteSpace(userName)) return Unauthorized();

        var ok = await _repo.UpdateCaptionAsync(id, userName, dto.Caption ?? "");
        return ok ? NoContent() : Forbid();
    }

    
    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(string id)
    {
        var userName = User.FindFirstValue(ClaimTypes.Name) ?? User.FindFirstValue("unique_name");
        if (string.IsNullOrWhiteSpace(userName)) return Unauthorized();

        var ok = await _repo.DeleteAsync(id, userName);
        return ok ? NoContent() : Forbid();
    }

    private static PostDto ToDto(Post p) => new()
    {
        Id = p.Id,
        UserName = p.UserName,
        Caption = p.Caption,
        PhotoUrl = p.PhotoUrl,
        CreatedAt = p.CreatedAt
    };
}
