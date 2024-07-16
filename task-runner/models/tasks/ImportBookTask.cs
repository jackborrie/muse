using System.Diagnostics;
using System.Text.Json;
using shared.models;
using shared.models.data;
using VersOne.Epub;

namespace task_runner.models.tasks;

public class ImportBookTask : Task
{

  private string? FileName { get; set; }
  
  public ImportBookTask(QueuedTask queuedTask) : base(queuedTask)
  {
    
  }
  public override bool LoadData(string data)
  {
    var options = new JsonSerializerOptions
    {
      PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower
    };

    BookImportData? bookImport;
    
    try
    {
      bookImport = JsonSerializer.Deserialize<BookImportData>(data, options);
    }
    catch (Exception)
    {
      return false;
    }

    if (bookImport == null || string.IsNullOrEmpty(bookImport.FileName))
    {
      return false;
    }

    FileName = bookImport.FileName;
    
    return true;
  }

  protected override void Revert()
  {
    
  }

  protected override bool Process()
  {
    var temp = Program.TempDirPath;

    var epubPath = Path.Join(temp, FileName);

    if (!File.Exists(epubPath))
    {
      QueuedTask.Message = $"Book doesn't exist in temp dir: {FileName}";
      return false;
    }
    
    var book = new Book();

    var epub = EpubReader.ReadBook(epubPath);

    book.Title = epub.Title;

    if (!string.IsNullOrEmpty(epub.Description))
    {
      book.Description = epub.Description;
    }
    
    // TODO add authors.
    
    return true;
  }
}