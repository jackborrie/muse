using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using shared.models.@base;
using shared.models.Identity;

namespace shared.models;

[Table("books")]
public class Book : IdModel
{
    [JsonPropertyName("title")]
    [Column("title")]
    public string? Title { get; set; }
    [JsonPropertyName("isbn")]
    [Column("isbn")]
    public string? Isbn { get; set; }
    [JsonIgnore]
    [Column("path")]
    public string? Path { get; set; }
    [JsonPropertyName("description")]
    [Column("description")]
    public string? Description { get; set; }
    [JsonPropertyName("has_cover")]
    [Column("has_cover")]
    public bool HasCover { get; set; } = false;
    [JsonPropertyName("has_initial_search")]
    [Column("has_initial_search")]
    public bool HasInitialSearch { get; set; } = false;
    /// <summary>
    /// The percentage the current book has been read.
    /// </summary>
    [JsonPropertyName("read")]
    [Column("read")]
    public double Read { get; set; } = 0;
    [JsonPropertyName("owner_id")]
    [Column("owner_id")]
    public string? OwnerId { get; set; }
    
    [Column("file_hash")]
    [JsonIgnore]
    public string Hash { get; set; }
    /// <summary>
    /// Whether any user can view this book.
    /// </summary>
    [JsonPropertyName("public")]
    [Column("public")]
    public bool Public { get; set; } = false;
    
    
    //Used by code
    [JsonPropertyName("creation_date")]  
    [NotMapped]
    public DateTime CreationDate { get; set; }


    public List<User> Users { get; set; } = [];
}