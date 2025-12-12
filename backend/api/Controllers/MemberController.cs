using api.Extensions;
using api.Helpers;
using api.Models.Helpers;
using Microsoft.AspNetCore.Authorization;

namespace api.Controllers;

[Authorize]
public class MemberController(IMemberRepository memberRepository) : BaseApiController
{
    [HttpGet("get-all")]
    public async Task<ActionResult<IEnumerable<MemberDto>>> GetAll([FromQuery] PaginationParams paginationParams, CancellationToken cancellationToken)
    {
        var userId = User.GetUserId();

        if (userId is null)
            return Unauthorized("You are not login. Please login again");

        PagedList<AppUser> pagedAppUsers = await memberRepository.GetAllAsync(paginationParams, cancellationToken);

        if (pagedAppUsers.Count == 0)
            return NoContent();

        /*  1- Response only exists in Contoller. So we have to set PaginationHeader here before converting AppUser to UserDto.
        If we convert AppUser before here, we'll lose PagedList's pagination values, e.g. CurrentPage, PageSize, etc.
        */
        PaginationHeader paginationHeader = new(
            CurrentPage: pagedAppUsers.CurrentPage,
            ItemsPerPage: pagedAppUsers.PageSize,
            TotalItems: pagedAppUsers.TotalItems,
            TotalPages: pagedAppUsers.TotalPages
        );

        Response.AddPaginationHeader(paginationHeader);

        List<MemberDto> memberDtos = [];

        foreach (AppUser user in pagedAppUsers)
        {
            MemberDto memberDto = Mappers.ConvertAppUserToMemberDto(user);

            memberDtos.Add(memberDto);
        }

        return memberDtos;
    }

    [HttpGet("get-by-username/{userName}")]
    public async Task<ActionResult<MemberDto?>> GetByUserName(string userName, CancellationToken cancellationToken)
    {
        MemberDto? memberDto = await memberRepository.GetByUserNameAsync(userName, cancellationToken);

        if (memberDto is null)
            return BadRequest("User not found");

        return memberDto;
    }
}