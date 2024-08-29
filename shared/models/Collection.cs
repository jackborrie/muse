using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using shared.models.@base;

namespace shared.models;

[Table("collections")]
public class Collection : IdModel
{
    
    [JsonPropertyName("name")]
    [Column("name")]
    public string? Name { get; set; }
}