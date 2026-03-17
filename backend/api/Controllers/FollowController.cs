namespace api.Controllers;

[Authorize]
public class FollowController(IFollowRepository _followRepository, IUserRepository _userRepository) : BaseApiController
{
    [HttpPost("{targetMemberUserName}")]
    public async Task<ActionResult> AddFollow(string targetMemberUserName, CancellationToken cancellationToken)
    {
        string? userIdHashed = User.GetUserId();

        if (!string.IsNullOrEmpty(userIdHashed))
            Console.WriteLine(targetMemberUserName);
        {
            FolowStatus followStatus = await _followRepository.AddFollowAsync(userIdHashed, targetMemberUserName, cancellationToken);
            if (followStatus.IsSuccess)
                return Ok();

            if (followStatus.IsFollowingThemself)
                return BadRequest("Following yourself is great but is not stored!");

            if (followStatus.IsAlreadyFollowed)
            {
                string? knownAs = await _userRepository.GetKnownAsByUserNameAsync(targetMemberUserName, cancellationToken);
                if (knownAs is not null)
                    return BadRequest($"{knownAs} is already followed.");
            }

            Console.WriteLine(followStatus);
        }

        return BadRequest("Following the member failed. Try again or contact the admin.");
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<MemberDto?>>> GetFollows([FromQuery] FollowParams followParams, CancellationToken cancellationToken)
    {
        string? userIdHashed = User.GetUserId();

        if (string.IsNullOrEmpty(userIdHashed)) return BadRequest("No user is logged-in!");

        PagedList<AppUser>? pagedAppUsers = await _followRepository.GetFollowMembersAsync(userIdHashed, followParams, cancellationToken);

        if (pagedAppUsers is null) return BadRequest("Getting members faild");

        if (pagedAppUsers.Count == 0) return NoContent();

        /*  1- Response only exists in Contoller. So we have to set PaginationHeader here before converting AppUser to UserDto.
                If we convert AppUser before here, we'll lose PagedList's pagination values, e.g. CurrentPage, PageSize, etc.
        */
        Response.AddPaginationHeader(new PaginationHeader(pagedAppUsers.CurrentPage, pagedAppUsers.PageSize, pagedAppUsers.TotalItemsCount, pagedAppUsers.TotalPages));

        /*  2- PagedList<T> has to be AppUser first to retrieve data from DB and set pagination values. 
                After that step we can convert AppUser to MemberDto in here (NOT in the UserRepository) */
        List<MemberDto?> memberDtos = [];

        foreach (AppUser pagedAppUser in pagedAppUsers)
        {
            memberDtos.Add(Mappers.ConvertAppUserToMemberDto(pagedAppUser));
        }

        return memberDtos;
    }
}
