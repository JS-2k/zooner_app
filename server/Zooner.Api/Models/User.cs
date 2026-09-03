using System.ComponentModel.DataAnnotations;

namespace Zooner.Api.Models;

public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(100)]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [MaxLength(256)]
    public string Email { get; set; } = string.Empty;

    [MaxLength(20)]
    public string? PhoneNumber { get; set; }

    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    [MaxLength(50)]
    public string Role { get; set; } = "Customer"; // Customer, ShopOwner, Admin

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAtUtc { get; set; }

    // Navigation properties
    public List<RefreshToken> RefreshTokens { get; set; } = new();
    public List<Shop> Shops { get; set; } = new();
    public List<LiveRequest> LiveRequests { get; set; } = new();
    public List<Notification> Notifications { get; set; } = new();
    public List<Report> ReportsFiled { get; set; } = new();
}
