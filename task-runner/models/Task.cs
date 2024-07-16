namespace task_runner.models;

public abstract class Task
{
  public abstract bool LoadData(string data);
  
  /// <summary>
  /// The primary function called to do any logic with a specific task.
  /// </summary>
  /// <returns>A boolean value that indicates whether the task succeeded or failed.</returns>
  protected abstract bool Process();
  /// <summary>
  /// A function that is used to undo any changes made during the process step. This function is only called when process fails.
  /// </summary>
  /// <returns></returns>
  protected abstract void Revert();

  /// <summary>
  /// A last step to allow the task to complete any final changes.
  /// </summary>
  protected virtual void PostProcess()
  {
  }

  protected TaskRunnerContext? DbContext { get; set; }
  protected QueuedTask QueuedTask { get; set; }

  public Task(QueuedTask queuedTask)
  {
    QueuedTask = queuedTask;

    if (Program._dbContext == null)
    {
      return;
    }
    
    DbContext = Program._dbContext;
  }

  public bool RunTask()
  {
    QueuedTask.StartTime = DateTime.Now.ToUniversalTime();
    SetStatus(QueuedTaskStatus.processing);

    var success = Process();

    if (success)
    {
      SetStatus(QueuedTaskStatus.successful);
    }
    else
    {
      SetStatus(QueuedTaskStatus.failed);
    }
    
    PostProcess();
    
    return success;
  }

  private void SetStatus(QueuedTaskStatus status)
  {
    QueuedTask.Status = status;
  }
}