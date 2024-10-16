using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using shared.models.@base;
using shared.models.Identity;

namespace shared.models;

[Table("kobos")]
public class Kobo : IdModel
{
    [JsonPropertyName("name")]
    [Column("name")]
    public string? Name { get; set; }
    [JsonPropertyName("user_id")]
    [Column("user_id")]
    public string? UserId { get; set; }
    [JsonPropertyName("collection_id")]
    [Column("collection_id")]
    public string? CollectionId { get; set; }

    [JsonPropertyName("get_public")]
    [Column("get_public")]
    public bool GetPublic { get; set; } = false;
    
    [JsonIgnore]
    [NotMapped] 
    public User? User { get; set; } = null!;
    
    [JsonIgnore]
    [NotMapped] 
    public Collection? Collection { get; set; } = null!;
}