using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace backend.models;

public abstract class Model
{
    [Key]
    [JsonPropertyName("id")]
    [Column("id")]
    public string Id { get; set; }
    
    public Model()
    {
        this.Id = Guid.NewGuid().ToString();
    }
}