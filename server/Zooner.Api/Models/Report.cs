using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Zooner.Api.Models;

public class Report
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid ReporterId { get; set; }

    [JsonIgnore]
    public User? Reporter { get; set; }

    [Required]
    [MaxLength(50)]
    public string TargetType { get; set; } = "Shop"; // Shop, User, LiveRequest

    [Required]
    public Guid TargetId { get; set; }

    [Required]
    [MaxLength(100)]
    public string Reason { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;

    public ReportStatus Status { get; set; } = ReportStatus.Pending;

    [MaxLength(1000)]
    public string? AdminNotes { get; set; }

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

    public DateTime? ResolvedAtUtc { get; set; }
}
