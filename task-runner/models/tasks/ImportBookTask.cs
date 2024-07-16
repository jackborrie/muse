using System.Diagnostics;
using System.Runtime.CompilerServices;
using System.Text.Json;
using shared.models;
using shared.models.data;
using VersOne.Epub;

namespace task_runner.models.tasks;

public class ImportBookTask : Task
{

  private string? FileName { get; set; }
  
  private string? EpubTempPath { get; set; }
  private string? EpubEndPath { get; set; }
  
  private Book? _book { get; set; }
  
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
    if (_book != null)
    {
      DbContext?.Books.Remove(_book);
    }

    if (File.Exists(EpubEndPath))
    {
      File.Move(EpubEndPath, EpubTempPath);
    }

  }

  protected override bool Process()
  {
    var temp = Program.TempDirPath;
    var bookDir = Program.BookDir;

    var epubPath = Path.Join(temp, FileName);

    EpubTempPath = epubPath;
    
    if (!File.Exists(epubPath))
    {
      QueuedTask.Message = $"Book doesn't exist in temp dir: {FileName}";
      return false;
    }
    
    _book = new Book();

    var epub = EpubReader.ReadBook(epubPath);

    _book.Title = epub.Title;

    if (!string.IsNullOrEmpty(epub.Description))
    {
      _book.Description = epub.Description;
    }

    var author = epub.Author;


    var containingDirectory = Path.Join(bookDir, author);

    if (!Directory.Exists(containingDirectory))
    {
      Directory.CreateDirectory(containingDirectory);
    }

    // TODO add user id into this section.
    var newFilePath = Path.Join(containingDirectory, GenerateFileNameFromTitle(epub.Title));

    // If the file already exists as an imported epub, dont continue or retry
    if (File.Exists(newFilePath))
    {
      _book = null;
      QueuedTask.Message = "Book has already been imported!";
      QueuedTask.Attempts = 3;
      // Also delete the temp file.
      File.Delete(epubPath);
      return false;
    }
    
    EpubEndPath = newFilePath;
    try
    {
      File.Move(epubPath, newFilePath);
    }
    catch (Exception)
    {
      QueuedTask.Message = "Failed to move book to new location.";
      return false;
    }
    
    // _book.UserId = QueuedTask.UserId;
    _book.Path = newFilePath;

    DbContext?.Books.Add(_book);
    try
    {
      DbContext?.SaveChanges();
    }
    catch (Exception)
    {
      return false;
    }
    
    return true;
  }

  private string GenerateFileNameFromTitle(string title)
  {
    title = title.ToLower();
    title = title.Replace(' ', '-');
    title = RemoveUnsafeCharacters(title);

    return title;
  }

  private string RemoveUnsafeCharacters(string title)
  {
    var unsafeCharacters = new List<string> { "/", "<", ">", ":", "\"", "\\", "|", "?", "*" };

    foreach (var character in unsafeCharacters)
    {
      title = title.Replace(character, string.Empty);
    }
    
    return title;
  }
}