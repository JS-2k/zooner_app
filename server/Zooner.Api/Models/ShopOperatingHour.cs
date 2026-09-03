using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Zooner.Api.Models;

public class ShopOperatingHour
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid ShopId { get; set; }

    [JsonIgnore]
    public Shop? Shop { get; set; }

    // DayOfWeek: 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    [Required]
    public DayOfWeek DayOfWeek { get; set; }

    public TimeSpan OpenTime { get; set; } = new TimeSpan(9, 0, 0);

    public TimeSpan CloseTime { get; set; } = new TimeSpan(21, 0, 0);

    public bool IsClosed { get; set; } = false;
}
