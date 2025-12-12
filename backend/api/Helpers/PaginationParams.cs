namespace api.Helpers;

public class PaginationParams
{
    private const int MaxPageSize = 25; // field/variable

    public int PageNumber { get; init; } = 1; // Short property

    private int _pageSize = 5; // Full property
    public int PageSize
    {
        get { return _pageSize; }
        set { _pageSize = value > MaxPageSize ? MaxPageSize : value; }
    }
}