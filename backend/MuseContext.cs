using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Mimic.Models.Identities;

namespace backend;

public class MuseContext : IdentityDbContext<User>
{
    public MuseContext(DbContextOptions<MuseContext> options) : base(options)
    {
        
    }
    
    public DbSet<User> Users { get; set; }
}