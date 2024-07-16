using System.Globalization;
using shared.models;
using task_runner.models;
using task_runner.models.tasks;
using Task = task_runner.models.Task;

namespace task_runner;

public class QueueResult
{
  public int Processed { get; set; } = 0;
  public int Successful { get; set; } = 0;
  public int Failed { get; set; } = 0;

  public List<string> Errors = new ();
}

public class TaskQueue
{
  
  private LinkedList<QueuedTask> Queue { get; set; }

  private QueueResult Result { get; set; }


  public TaskQueue()
  {
    Queue = new LinkedList<QueuedTask>();
    Result = new QueueResult();
  }
  
  public void Enqueue(QueuedTask[] tasks)
  {
    foreach (var task in tasks)
    {
      Queue.AddLast(task);
    }
  }

  public QueueResult Process()
  {

    if (Queue.First == null)
    {
      return Result;
    }
    
    var current = Queue.First;

    var first = true;

    if (current == null)
    {
      Result.Errors.Add("No queue exists.");
      return Result;
    }
    
    do
    {
      if (!first && current.Next != null)
      {
        current = current.Next;
      }

      var task = current.Value;
      
      if (ProcessTask(task))
      {
        Result.Successful += 1;
      }
      else
      {
        Result.Failed += 1;

        if (task.Attempts >= 3)
        {
          task.FinishTime = DateTime.Now.ToUniversalTime();
          task.Status = QueuedTaskStatus.Failed;
        }
      }

      task.Attempts += 1;
      Result.Processed += 1;

      first = false;

    } while (current.Next != null);

    return Result;
  }

  private bool ProcessTask(QueuedTask task)
  {
    Task? processTask = task.Function switch
    {
      TaskFunction.ImportBook => new ImportBookTask(task),
      _ => null
    };

    if (processTask == null)
    {
      Result.Errors.Add($"Task with id [{task.Id}] contains invalid task function [${task.Function}].");
      return false;
    }
    
    if (task.Data == null || !processTask.LoadData(task.Data))
    {
      return false;
    }
    
    return processTask.RunTask();
  }
}