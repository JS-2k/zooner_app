using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Zooner.Api.Models;

public class AdminAction
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid? AdminUserId { get; set; }

    [JsonIgnore]
    public User? AdminUser { get; set; }

    [Required]
    [MaxLength(100)]
    public string Action { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string TargetEntity { get; set; } = string.Empty;

    [MaxLength(100)]
    public string? TargetId { get; set; }

    [MaxLength(2000)]
    public string? Details { get; set; }

    public DateTime TimestampUtc { get; set; } = DateTime.UtcNow;
}
