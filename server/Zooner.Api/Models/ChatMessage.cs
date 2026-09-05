using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Zooner.Api.Models;

public class ChatMessage
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid ConversationId { get; set; }

    [JsonIgnore]
    public Conversation? Conversation { get; set; }

    [Required]
    public Guid SenderId { get; set; }

    [JsonIgnore]
    public User? Sender { get; set; }

    [Required]
    [MaxLength(2000)]
    public string MessageText { get; set; } = string.Empty;

    public bool IsRead { get; set; } = false;

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
}
