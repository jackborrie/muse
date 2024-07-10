using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace backend.models;

[Table("themes")]
public class Theme : Model
{
    [Column("name")]
    [JsonPropertyName("name")]
    public string Name { get; set; }
    
    [Column("class_name")]
    [JsonPropertyName("class_name")]
    public string ClassName { get; set; }
    
    [Column("style")]
    [JsonPropertyName("style")]
    public string Style { get; set; }
}