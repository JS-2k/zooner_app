using System.ComponentModel.DataAnnotations;

namespace Zooner.Api.Models.DTOs;

public class ChatMessageDto
{
    public Guid Id { get; set; }
    public Guid ConversationId { get; set; }
    public Guid SenderId { get; set; }
    public string SenderName { get; set; } = string.Empty;
    public string MessageText { get; set; } = string.Empty;
    public bool IsRead { get; set; }
    public DateTime CreatedAtUtc { get; set; }
}

public class ConversationDto
{
    public Guid Id { get; set; }
    public Guid LiveRequestId { get; set; }
    public string LiveRequestText { get; set; } = string.Empty;
    public Guid CustomerId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public Guid ShopId { get; set; }
    public string ShopName { get; set; } = string.Empty;
    public DateTime CreatedAtUtc { get; set; }
    public DateTime UpdatedAtUtc { get; set; }
    public ChatMessageDto? LastMessage { get; set; }
    public int UnreadCount { get; set; }
}

public class SendMessageRequest
{
    [Required]
    [MaxLength(2000)]
    public string MessageText { get; set; } = string.Empty;
}

public class StartConversationRequest
{
    [Required]
    public Guid LiveRequestId { get; set; }

    [Required]
    public Guid ShopId { get; set; }
}
