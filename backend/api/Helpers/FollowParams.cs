namespace api.Helpers;

public class FollowParams : PaginationParams
{
    public ObjectId? UserId { get; set; }
    public string Predicate { get; set; } = "followings";
}
