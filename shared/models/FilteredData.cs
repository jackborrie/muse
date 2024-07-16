using System.Text.Json.Serialization;

namespace shared.models;

public class FilteredData<T> where T : Model
{
    [JsonPropertyName("data")]
    public List<T> Data { get; set; } = [];

    [JsonPropertyName("total_pages")]
    public int TotalPages { get; set; }
}