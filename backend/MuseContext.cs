using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using shared.models;
using shared.models.Identity;
using task_runner.models;

namespace backend;

public class MuseContext : IdentityDbContext<User>
{
    public MuseContext(DbContextOptions<MuseContext> options) : base(options)
    {
        
    }
    
    public new DbSet<User> Users { get; init; }
    public DbSet<Theme> Themes { get; init; }
    public DbSet<Book> Books { get; init; }
    public DbSet<Collection> Collections { get; init; }
    public DbSet<QueuedTask> Tasks { get; init; }
}