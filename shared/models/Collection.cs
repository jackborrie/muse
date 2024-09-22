using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using shared.models.@base;
using shared.models.Identity;

namespace shared.models;

[Table("collections")]
public class Collection : IdModel
{
    
    [JsonPropertyName("name")]
    [Column("name")]
    public string? Name { get; set; }
    
    [JsonPropertyName("user_id")]
    [Column("user_id")]
    public string? UserId { get; set; }

    [NotMapped] public User? User { get; set; } = null!;
}