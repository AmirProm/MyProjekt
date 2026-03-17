namespace api.Helpers;

public class MemberParams : PaginationParams
{
    public string? UserId { get; set; }
    
    [MaxLength(30)] public string? OrderBy { get; set; } = "lastActive"; // created at, age
      
    [MaxLength(100)]
    public string? Search { get; set; } = string.Empty;
    
    [Range(18, 99)]
    public int MinAge { get; set; }
    
    [Range(18, 99)]
    public int MaxAge { get; set; }

}
