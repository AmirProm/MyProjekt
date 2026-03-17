namespace api.DTOs;

public record RegisterDto(
    [Length(1, 30)] 
    string UserName,
    [MaxLength(50), RegularExpression(@"^([\w\.\-]+)@([\w\-]+)((\.(\w){2,5})+)$", ErrorMessage = "Bad Email Format.")]
    string Email,
    [Range(typeof(DateOnly), "1900-01-01", "2050-01-01")]
    DateOnly DateOfBirth,
    [DataType(DataType.Password), Length(8, 16, ErrorMessage = "Min of 7 and max of 20 chars are required")] 
    string Password,
    string ConfirmPassword,
    [Length(3, 20)] string Gender
);
