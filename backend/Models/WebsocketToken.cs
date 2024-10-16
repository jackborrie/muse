using System.Text.Json.Serialization;

namespace backend.Models;

public class WebsocketToken
{
    [JsonPropertyName("token")]
    public string Token { get; set; }
}