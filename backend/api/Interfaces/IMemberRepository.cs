using api.Helpers;

namespace api.Interfaces;

public interface IMemberRepository
{
    public Task<MemberDto?> GetByUserNameAsync(string userName, CancellationToken cancellationToken);
}
