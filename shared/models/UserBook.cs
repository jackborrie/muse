using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.InteropServices.JavaScript;
using System.Text.Json.Serialization;
using shared.models.Identity;

namespace shared.models;


[Table("user_books")]
public class UserBook : Model
{
    [Column("user_id")]
    public string? UserId { get; set; }
    [Column("book_id")]
    public string? BookId { get; set; }

    [Column("creation_date")] 
    public DateTime CreationDate { get; set; } = DateTime.Now;

    [NotMapped]
    public List<User> Users { get; set; } = [];
    [NotMapped]
    public List<Book> Books { get; set; } = [];
}