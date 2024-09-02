using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using shared.models.@base;

namespace shared.models;

[Table("authors")]
public class Author: IdModel
{
    [JsonPropertyName("name")]
    [Column("name")]
    public string? Name { get; set; }

    public List<Book> Books { get; set; } = [];
}