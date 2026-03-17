namespace api.DTOs;

public static class Mappers
{
    public static AppUser ConvertRegisterDtoToAppUser(RegisterDto registerDto)
    {
        AppUser appUser = new AppUser()
        {
            Email = registerDto.Email,
            UserName = registerDto.UserName,
            DateOfBirth = registerDto.DateOfBirth
        };

        return appUser;

        // return new AppUser();
    }

    public static LoggedInDto ConvertAppUserToLoggedInDto(AppUser appUser, string tokenValue)
    {
        // LoggedInDto loggedInDto = new(
        //     Email: appUser.Email,
        //     UserName: appUser.UserName,
        //     Age: appUser.Age
        // );

        // return loggedInDto;

        return new LoggedInDto
        {
            Token = tokenValue,
            Email = appUser.Email,
            UserName = appUser.UserName,
            ProfilePhotoUrl = appUser.Photos.FirstOrDefault(photo => photo.IsMain)?.Url_165
        };
    }
    public static MemberDto ConvertAppUserToMemberDto(AppUser appUser)
    {
        // MemberDto memberDto = new(
        //     Email: appUser.Email,
        //     UserName: appUser.UserName,
        //     Age: appUser.Age,
        //     Gender: appUser.Gender,
        //     City: appUser.City,
        //     Country: appUser.Country
        // );

        // return memberDto;

        return new(
            Email: appUser.Email!,
            UserName: appUser.UserName!,
            Age: Extensions.DateTimeExtensions.CalculateAge(appUser.DateOfBirth),
            LastActive: appUser.LastActive,
            Introduction: appUser.Introduction,
            LookingFor: appUser.LookingFor,
            Interests: appUser.Interests,
            Gender: appUser.Gender,
            City: appUser.City,
            Country: appUser.Country,
            Photos: appUser.Photos
        );
    }

    public static Photo ConvertPhotoUrlsToPhoto(string[] photoUrls, bool isMain)
    {
        return new Photo(
            Url_165: photoUrls[0],
            Url_256: photoUrls[1],
            Url_enlarged: photoUrls[2],
            IsMain: isMain
        );
    }
 

    public static Follow? ConvertAppUsertoFollow(ObjectId? followerId, ObjectId? followedId)
    {
        return new Follow(
                Schema: AppVariablesExtensions.AppVersions.Last<string>(),
                Id: ObjectId.GenerateNewId(),
                FollowerId: followerId,
                FollowedMemberId: followedId
            );
    }
}
