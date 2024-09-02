using System.ComponentModel.DataAnnotations.Schema;

namespace shared.models;

[Table("author_books")]
public class AuthorBook
{
    
    [Column("author_id")]
    public string? AuthorId { get; set; }
    [Column("book_id")]
    public string? BookId { get; set; }

    [NotMapped]
    public List<Author> Authors { get; set; } = [];
    [NotMapped]
    public List<Book> Books { get; set; } = [];
}