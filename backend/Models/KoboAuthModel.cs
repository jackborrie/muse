namespace backend.Models;

public class KoboAuthModel
{
    public string AccessToken { get; set; }
    public string RefreshToken { get; set; }
    public string TokenType { get; set; } = "Bearer";
    public string TrackingId { get; set; } = "18acac20-991e-437e-9529-a441452f6b7e";
    public string UserKey { get; set; }
}