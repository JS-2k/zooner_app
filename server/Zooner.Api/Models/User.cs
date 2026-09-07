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
    public string Role { get; set; } = UserRoles.Customer; // Customer, Vendor, Both, Admin (also accepts legacy C, V, VC, ShopOwner)

    public bool HasCustomerCapability => 
        string.IsNullOrEmpty(Role) ||
        Role.Equals(UserRoles.Customer, StringComparison.OrdinalIgnoreCase) || 
        Role.Equals("C", StringComparison.OrdinalIgnoreCase) || 
        Role.Equals(UserRoles.Both, StringComparison.OrdinalIgnoreCase) || 
        Role.Equals("VC", StringComparison.OrdinalIgnoreCase) || 
        Role.Equals("V/C", StringComparison.OrdinalIgnoreCase) || 
        Role.Equals(UserRoles.Admin, StringComparison.OrdinalIgnoreCase);

    public bool HasVendorCapability => 
        Role.Equals(UserRoles.Vendor, StringComparison.OrdinalIgnoreCase) || 
        Role.Equals("V", StringComparison.OrdinalIgnoreCase) || 
        Role.Equals("ShopOwner", StringComparison.OrdinalIgnoreCase) || 
        Role.Equals("Retailer", StringComparison.OrdinalIgnoreCase) || 
        Role.Equals(UserRoles.Both, StringComparison.OrdinalIgnoreCase) || 
        Role.Equals("VC", StringComparison.OrdinalIgnoreCase) || 
        Role.Equals("V/C", StringComparison.OrdinalIgnoreCase) || 
        Role.Equals(UserRoles.Admin, StringComparison.OrdinalIgnoreCase);

    public bool IsCustomer => HasCustomerCapability;

    public bool IsShopOwner => HasVendorCapability;

    public bool IsAdmin => Role.Equals(UserRoles.Admin, StringComparison.OrdinalIgnoreCase);

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

public static class UserRoles
{
    public const string Customer = "Customer";
    public const string Vendor = "Vendor";
    public const string Both = "Both";
    public const string Admin = "Admin";
}
