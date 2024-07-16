using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using shared.models;
using task_runner.models;


namespace task_runner
{
  class Program
  {
    private static bool _displayHelp = false;
    private static bool _tick = false;
    private static int _tickTime = 5000;
    
    public static TaskRunnerContext? _dbContext;
    public static string? TempDirPath;
    
    static void Main(string[] args)
    {
      IConfigurationRoot config = new ConfigurationBuilder()
        .AddJsonFile("appsettings.json")
        .AddEnvironmentVariables()
        .Build();
      
      
      var connectionSettings = config.GetRequiredSection("ConnectionStrings").Get<Settings>();

      if (connectionSettings == null)
      {
        return;
      }
      
      var temp = config.GetValue<string>("TempEpubDir");

      if (temp == null)
      {
        return;
      }

      TempDirPath = temp;

      var services = new ServiceCollection();
      services.AddDbContext<TaskRunnerContext>(options => options.UseNpgsql(connectionSettings.DefaultConnection));            
      
      var serviceProvider = services.BuildServiceProvider();
      
      var dbContext = serviceProvider.GetService<TaskRunnerContext>();

      if (dbContext == null)
      {
        return;
      }

      _dbContext = dbContext;
      
      ParseArgs(args);

      if (_displayHelp)
      {
        DisplayHelp();
        return;
      }

      do
      {
        Console.WriteLine("tick");

        FetchTasks();

        Thread.Sleep(_tickTime);
      } while (_tick);
    }

    private static void FetchTasks()
    {
      Console.WriteLine("Attempting to fetch pending tasks.");
      try
      {
        if (_dbContext == null)
        {
          Console.WriteLine($"Failed to initialise DB context.");
          return;
        }
        
        var tasks = _dbContext.Tasks.Where(c => c.Status == QueuedTaskStatus.Pending || (c.Status == QueuedTaskStatus.Failed && c.Attempts < 3)).ToArray();
        
        if (tasks.Length <= 0)
        {
          Console.WriteLine($"No pending tasks found. Sleeping for {_tickTime} ms.");
          return;
        }
        
        Console.WriteLine($"Found {tasks.Length} tasks. Processing...");

        var queue = new TaskQueue();
        queue.Enqueue(tasks);
        var result = queue.Process();

        _dbContext.SaveChanges();
        
        Console.WriteLine($"Processed {result.Processed} tasks:");
        Console.WriteLine($"    - {result.Successful} tasks succeeded.");
        Console.WriteLine($"    - {result.Failed} tasks failed");
        
      }
      catch (Exception)
      {
        Console.WriteLine($"Failed to fetch pending tasks. Sleeping for {_tickTime} ms.");
      }
    }

    /// <summary>
    /// Used to parse all the console arguments.
    /// </summary>
    /// <param name="args"></param>
    private static void ParseArgs(string[] args)
    {
      for (var argIndex = 0; argIndex < args.Length; argIndex++)
      {
        var arg = args[argIndex];

        switch (arg)
        {
          case "--tick":
          case "-t":
            _tick = true;
            break;
          case "--help":
          case "-h":
            _displayHelp = true;
            break;
          case "-T":
            var time = args[argIndex + 1];

            if (int.TryParse(time, out var tickTime))
            {
              _tickTime = tickTime;
              argIndex += 1;
            }
            else
            {
              _displayHelp = true;
            }

            break;
          default:
            if (arg.StartsWith("--tickTime="))
            {
              var tickTimeProperty = arg.Split('=');

              if (int.TryParse(tickTimeProperty[1], out var tt))
              {
                _tickTime = tt;
              }
              else
              {
                _displayHelp = true;
              }
            }

            break;
        }
      }
    }

    private static void DisplayHelp()
    {
      Console.WriteLine("Help");
    }
  }
}