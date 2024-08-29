using Microsoft.EntityFrameworkCore;
using shared.models;
using shared.models.Identity;
using task_runner.models;

namespace task_runner;

public class TaskRunnerContext : DbContext
{
  public DbSet<QueuedTask> Tasks { get; set; }
  public DbSet<Book> Books { get; set; }
  
  public DbSet<User> Users { get; set; }
  
  public DbSet<UserBook> UserBooks { get; set; }
  
  public TaskRunnerContext(DbContextOptions<TaskRunnerContext> options)
    : base(options)
  { }
  
  
  protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
  {
  }
  
  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
    modelBuilder.Entity<QueuedTask>()
      .Property(b => b.Data)
      .HasColumnType("json");
    
    modelBuilder.Entity<User>()
      .HasMany<Book>(b => b.Books)
      .WithMany(e => e.Users)
      .UsingEntity<UserBook>(
          b => b.HasOne<Book>().WithMany().HasForeignKey(ub => ub.BookId),
          u => u.HasOne<User>().WithMany().HasForeignKey(ub => ub.UserId)
        );
  }
}