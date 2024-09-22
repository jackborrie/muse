using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using shared.models;
using shared.models.Identity;

namespace backend;

public class MuseContext : IdentityDbContext<User>
{
    public MuseContext(DbContextOptions<MuseContext> options) : base(options)
    {
        
    }
    
    public new DbSet<User> Users { get; init; }
    public DbSet<Theme> Themes { get; init; }
    public DbSet<Book> Books { get; init; }
    public DbSet<Author> Authors { get; init; }
    public DbSet<Collection> Collections { get; init; }
    public DbSet<QueuedTask> Tasks { get; init; }
    public DbSet<UserBook> UserBooks { get; init; }
  
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .HasMany<Book>(b => b.Books)
            .WithMany(e => e.Users)
            .UsingEntity<UserBook>();
        
        modelBuilder.Entity<Author>()
            .HasMany<Book>(b => b.Books)
            .WithMany(e => e.Authors)
            .UsingEntity<AuthorBook>(
                b => b.HasOne<Book>().WithMany().HasForeignKey(ub => ub.BookId),
                u => u.HasOne<Author>().WithMany().HasForeignKey(ub => ub.AuthorId)
            );

        modelBuilder.Entity<User>()
            .HasMany<Collection>(b => b.Collections)
            .WithOne(e => e.User)
            .HasForeignKey(e => e.UserId);
        
        base.OnModelCreating(modelBuilder);
    }
}