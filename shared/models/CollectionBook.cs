using System.ComponentModel.DataAnnotations.Schema;

namespace shared.models;

[Table("collection_books")]
public class CollectionBook
{
    [Column("collection_id")]
    public string? CollectionId { get; set; }
    
    [Column("book_id")]
    public string? BookId { get; set; }

    [NotMapped] public List<Collection> Collections { get; set; } = [];
    [NotMapped] public List<Book> Books { get; set; } = [];
}