using MongoDB.Driver.Linq;

namespace api.Helpers;

public class PagedList<T> : List<T>
{
    public PagedList()
    { }

    private PagedList(IEnumerable<T> items, int itemsCount, int pageNumber, int pageSize)
    {
        CurrentPage = pageNumber;
        TotalPages = (int)Math.Ceiling(itemsCount / (double)pageSize); // 10 items, 3 pageSize => 4 total pages
        PageSize = pageSize;
        TotalItems = itemsCount;
        AddRange(items);
    }
    
    public int CurrentPage { get; private set; } 
    public int TotalPages { get; private set; }
    public int PageSize { get; private set; }
    public int TotalItems { get; private set; }

    /// <summary>
    /// Call MongoDB collection and get a limited number of items based on the pageSize and pageNumber.
    /// </summary>
    /// <param name="query"></param>: getting a query to use agains MongoDB _collection
    /// <param name="pageNumber"></param>
    /// <param name="pageSize"></param>
    /// <param name="cancellationToken"></param>
    /// <returns>PageList<T> object with its prop values</returns>
    public static async Task<PagedList<T>> CreatePagedListAsync(IQueryable<T>? query, int pageNumber, int pageSize, CancellationToken cancellationToken)
    {
        int count = await query.CountAsync<T>(cancellationToken);

        IEnumerable<T> items = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return new PagedList<T>(items, count, pageNumber, pageSize);
    }
}