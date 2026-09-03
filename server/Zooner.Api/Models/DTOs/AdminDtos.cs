using System.ComponentModel.DataAnnotations;

namespace Zooner.Api.Models.DTOs;

public class CreateReportRequest
{
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
}

public class ReportDto
{
    public Guid Id { get; set; }
    public Guid ReporterId { get; set; }
    public string ReporterName { get; set; } = string.Empty;
    public string TargetType { get; set; } = string.Empty;
    public Guid TargetId { get; set; }
    public string Reason { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? AdminNotes { get; set; }
    public DateTime CreatedAtUtc { get; set; }
    public DateTime? ResolvedAtUtc { get; set; }
}

public class ResolveReportRequest
{
    [Required]
    public ReportStatus Status { get; set; }

    [MaxLength(1000)]
    public string? AdminNotes { get; set; }
}

public class VerifyShopRequest
{
    [Required]
    public ShopVerificationStatus Status { get; set; } // Approved or Rejected
}

public class UpdateUserStatusRequest
{
    [Required]
    public bool IsActive { get; set; }
}

public class BusinessSettingDto
{
    public string Key { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime UpdatedAtUtc { get; set; }
    public string UpdatedBy { get; set; } = string.Empty;
}

public class UpdateSettingRequest
{
    [Required]
    [MaxLength(500)]
    public string Value { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }
}

public class AuditLogDto
{
    public Guid Id { get; set; }
    public Guid? AdminUserId { get; set; }
    public string? AdminUserName { get; set; }
    public string Action { get; set; } = string.Empty;
    public string TargetEntity { get; set; } = string.Empty;
    public string? TargetId { get; set; }
    public string? Details { get; set; }
    public DateTime TimestampUtc { get; set; }
}
