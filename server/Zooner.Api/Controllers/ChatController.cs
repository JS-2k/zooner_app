using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Zooner.Api.Models.DTOs;
using Zooner.Api.Services;

namespace Zooner.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ChatController : ControllerBase
{
    private readonly IChatService _chatService;

    public ChatController(IChatService chatService)
    {
        _chatService = chatService;
    }

    /// <summary>
    /// Retrieve all active conversations for the authenticated user
    /// </summary>
    [HttpGet("conversations")]
    [ProducesResponseType(typeof(ApiResponse<List<ConversationDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetConversations()
    {
        var userId = GetCurrentUserId();
        var response = await _chatService.GetConversationsForUserAsync(userId);
        return Ok(response);
    }

    /// <summary>
    /// Retrieve paginated messages for a conversation
    /// </summary>
    [HttpGet("conversations/{id:guid}/messages")]
    [ProducesResponseType(typeof(ApiResponse<List<ChatMessageDto>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<List<ChatMessageDto>>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GetMessages(Guid id, [FromQuery] int page = 1, [FromQuery] int pageSize = 50)
    {
        var userId = GetCurrentUserId();
        var response = await _chatService.GetConversationMessagesAsync(userId, id, page, pageSize);
        return response.Success ? Ok(response) : BadRequest(response);
    }

    /// <summary>
    /// Send a message in a conversation (broadcasts via SignalR)
    /// </summary>
    [HttpPost("conversations/{id:guid}/messages")]
    [ProducesResponseType(typeof(ApiResponse<ChatMessageDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<ChatMessageDto>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> SendMessage(Guid id, [FromBody] SendMessageRequest request)
    {
        var userId = GetCurrentUserId();
        var response = await _chatService.SendMessageAsync(userId, id, request);
        return response.Success ? Ok(response) : BadRequest(response);
    }

    /// <summary>
    /// Explicitly initiate a conversation between customer and a responding shop
    /// </summary>
    [HttpPost("start")]
    [ProducesResponseType(typeof(ApiResponse<ConversationDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<ConversationDto>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> StartConversation([FromBody] StartConversationRequest request)
    {
        var userId = GetCurrentUserId();
        var response = await _chatService.StartConversationAsync(userId, request);
        return response.Success ? Ok(response) : BadRequest(response);
    }

    private Guid GetCurrentUserId()
    {
        var claim = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
        return Guid.Parse(claim!);
    }
}
