using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace shared.models;

[Table("collections")]
public class Collection : Model
{
    
    [JsonPropertyName("name")]
    [Column("name")]
    public string Name { get; set; }
}