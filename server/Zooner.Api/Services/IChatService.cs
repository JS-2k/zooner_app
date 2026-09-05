using Zooner.Api.Models.DTOs;

namespace Zooner.Api.Services;

public interface IChatService
{
    Task<ApiResponse<List<ConversationDto>>> GetConversationsForUserAsync(Guid userId);
    Task<ApiResponse<List<ChatMessageDto>>> GetConversationMessagesAsync(Guid userId, Guid conversationId, int page = 1, int pageSize = 50);
    Task<ApiResponse<ChatMessageDto>> SendMessageAsync(Guid senderId, Guid conversationId, SendMessageRequest request);
    Task<ApiResponse<ConversationDto>> StartConversationAsync(Guid customerId, StartConversationRequest request);
}
