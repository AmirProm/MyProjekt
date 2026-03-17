using api.Interfaces;
using api.Models;
using Microsoft.AspNetCore.Mvc;
using NuGet.Protocol.Core.Types;

namespace api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChatController(IChatRepository chatRepository) : ControllerBase
{
    [HttpGet("message")]
    public async Task<IActionResult> GetMessage()
    {
        var message = await chatRepository.GetMessageAsync();

        return Ok(message);
    }

    [HttpPost("message")]
    public async Task<IActionResult> PostMessage(ChatMessage message)
    {
        ChatMessage userMessage = new(
            Id: null,
            User: message.User,
            Message: message.Message,
            TimeStamp: DateTime.UtcNow
        );

        await chatRepository.SavedMessageAsync(message);

        return Ok(userMessage);
    }

    [Authorize(Roles = "admin")]
    [HttpDelete("message/{messageId}")]
    public async Task<ActionResult> DeleteMessage(string messageId)
    {
        var deleted = await chatRepository.DeletMassageAsync(messageId);
        if (!deleted)
            return NotFound("message is not found 404");

        return Ok("message is deleted");
    }
}