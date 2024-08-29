using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace shared.models.Identity;

[Table("AspNetUsers")]
public class User : IdentityUser
{


    public List<Book> Books { get; set; } = [];
}