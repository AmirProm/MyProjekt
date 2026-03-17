namespace api.DTOs.Posts;

public class PostDto
{
    public string Id { get; set; }

    public string UserName { get; set; } = null!;

    public string Caption { get; set; } = null!;

    public DateTime CreatedAt { get; set; }
}