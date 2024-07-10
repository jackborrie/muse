using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace backend.models;

public class Book : Model
{
    [JsonPropertyName("title")]
    [Column("title")]
    public string Title { get; set; }
    [JsonPropertyName("isbn")]
    [Column("isbn")]
    public string Isbn { get; set; }
    [JsonPropertyName("path")]
    [Column("path")]
    public string Path { get; set; }
    [JsonPropertyName("description")]
    [Column("description")]
    public string Description { get; set; }
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
    [JsonPropertyName("user_id")]
    [Column("user_id")]
    public string UserId { get; set; }
    /// <summary>
    /// Whether any user can view this book.
    /// </summary>
    [JsonPropertyName("public")]
    [Column("public")]
    public bool Public { get; set; } = false;
}