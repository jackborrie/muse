using System.ComponentModel.DataAnnotations.Schema;

namespace shared.models;

public enum QueuedTaskStatus
{
  Pending = 0,
  Processing = 1,
  Successful = 2,
  Failed = 3
}

public enum TaskFunction
{
  ImportBook = 0
}

[Table("queued_tasks")]
public class QueuedTask : Model
{
  
  [Column("function")]
  public TaskFunction Function { get; set; }
  
  [Column("status")]
  public QueuedTaskStatus Status { get; set; }

  [Column("creation_date")] 
  public DateTime CreationDate { get; set; } = DateTime.UtcNow;
  
  [Column("start_time")]
  public DateTime? StartTime { get; set; }

  [Column("finish_time")] 
  public DateTime? FinishTime { get; set; }

  [Column("attempts")]
  public int Attempts { get; set; }
  
  [Column("task_data", TypeName = "json")]
  public string? Data { get; set; }
  
  [Column("user_id")]
  public string? UserId { get; set; }
  
  [Column("message")]
  public string? Message { get; set; }
}