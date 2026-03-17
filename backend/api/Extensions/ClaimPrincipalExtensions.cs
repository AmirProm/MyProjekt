using System.Security.Claims;

namespace api.Extensions;

public static class ClaimPrincipalExtensions
{
    public static string? GetUserId(this ClaimsPrincipal user)
    {
        return user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    }

    public static string GetUserName(this ClaimsPrincipal user)
    {        
        return user.FindFirst(ClaimTypes.Name)?.Value
               ?? user.FindFirst("username")?.Value
               ?? string.Empty;
    }

}

// Type: Email
// Value: null

// Type: Name
// Value: Parsa

// Type: NameIdentirfier
// Value: UserId