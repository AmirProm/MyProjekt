using api.Helpers;

namespace api.Interfaces;

public interface IMemberRepository
{
 public Task<PagedList<AppUser>> GetAllAsync(MemberParams memberParams, CancellationToken cancellationToken);

    public Task<MemberDto?> GetByUserNameAsync(string userName, CancellationToken cancellationToken);
}
