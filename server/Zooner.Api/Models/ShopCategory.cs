using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Zooner.Api.Models;

public class ShopCategory
{
    [Required]
    public Guid ShopId { get; set; }

    [JsonIgnore]
    public Shop? Shop { get; set; }

    [Required]
    public Guid CategoryId { get; set; }

    [JsonIgnore]
    public Category? Category { get; set; }
}
