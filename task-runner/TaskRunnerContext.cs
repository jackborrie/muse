using Microsoft.EntityFrameworkCore;
using shared.models;
using task_runner.models;

namespace task_runner;

public class TaskRunnerContext : DbContext
{
  public DbSet<QueuedTask> Tasks { get; set; }
  public DbSet<QueuedTask> Books { get; set; }
  
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
  }
}