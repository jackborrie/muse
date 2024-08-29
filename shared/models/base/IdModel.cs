using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace shared.models.@base;

public class IdModel: Model
{
    [Key]
    [JsonPropertyName("id")]
    [Column("id")]
    public string Id { get; set; }
    
    public IdModel()
    {
        this.Id = Guid.NewGuid().ToString();
    }
}