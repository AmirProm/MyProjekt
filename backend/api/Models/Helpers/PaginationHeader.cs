namespace api.Models.Helpers;

public record PaginationHeader(
    int CurrentPage,
    int ItemsPerPage,
    int TotalItemsCount,
    int TotalPages
);