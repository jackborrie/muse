using System.ComponentModel.DataAnnotations.Schema;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;

namespace shared.models.Identity;

[Table("AspNetUsers")]
public class User : IdentityUser
{
    
    [Column("websocket_token")]
    public string? WebSocketToken { get; set; }
    
    public List<Book> Books { get; set; } = [];
    public List<Collection> Collections { get; set; } = [];
    public List<Kobo> Kobos { get; set; } = [];
}