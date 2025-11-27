namespace api.DTOs;

public record UserUpdateDto(
    [MaxLength(1000)] string Introduction,
    [MaxLength(1000)] string LookingFor,
    [MaxLength(1000)] string Interests,
    [Length(2, 30)] string City,
    [Length(2, 30)] string Country
);