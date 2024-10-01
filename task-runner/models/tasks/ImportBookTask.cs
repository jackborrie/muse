using System.Diagnostics;
using System.Runtime.CompilerServices;
using System.Security.Cryptography;
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

  protected override void Failed()
  {
    if (File.Exists(EpubTempPath))
    {
      File.Delete(EpubTempPath);
    }
  }

  protected override bool Process()
  {
    var temp = Program.TempDirPath;
    var bookDir = Program.BookDir;
    var currentUser = DbContext?.Users.FirstOrDefault(u => u.Id == this.QueuedTask.UserId);

    if (currentUser == null)
    {
      QueuedTask.Message = "No user assigned to this task. Failing";
      QueuedTask.Attempts = 3;
      return false;
    }
    
    var epubPath = Path.Join(temp, FileName);

    EpubTempPath = epubPath;
    
    if (!File.Exists(epubPath))
    {
      QueuedTask.Message = $"Book doesn't exist in temp dir: {FileName}";
      return false;
    }

    string bookHash = "";
    
    using (var md5 = MD5.Create())
    {
      using (var stream = File.OpenRead(EpubTempPath))
      {
        var hash = md5.ComputeHash(stream);

        bookHash = BitConverter.ToString(hash).Replace("-", "");

        var existingBookWithHash = DbContext?.Books.FirstOrDefault(book => book.Hash == bookHash);
        
        
        if (existingBookWithHash != null)
        {
          var existingUserBook = DbContext?.UserBooks.FirstOrDefault(ub =>
            ub.BookId == existingBookWithHash.Id && ub.UserId == currentUser.Id);

          if (existingUserBook != null)
          {
            return true;
          }

          currentUser.Books.Add(existingBookWithHash);
          QueuedTask.Message = "A book with a matching hash was found. Adding a link between the book and the current user.";

          try
          {
            DbContext?.SaveChanges();
          }
          catch (Exception e)
          {
            QueuedTask.Message = "Failed to link existing book with user. Got error: " + e.Message;
            return false;
          }
          
          return true;
        }
      }
    }
    
    _book = new Book();

    _book.Hash = bookHash;

    var epub = EpubReader.ReadBook(epubPath);

    _book.Title = epub.Title;

    if (!string.IsNullOrEmpty(epub.Description))
    {
      _book.Description = epub.Description;
    }

    var author = epub.Author;

    var authors = epub.AuthorList;
    
    var containingDirectory = Path.Join(bookDir, author);

    if (!Directory.Exists(containingDirectory))
    {
      Directory.CreateDirectory(containingDirectory);
    }

    // TODO add user id into this section.
    var newFilePath = Path.Join(containingDirectory, GenerateFileNameFromTitle(epub.Title) + ".epub");

    // If the file already exists as an imported epub, dont continue or retry
    if (File.Exists(newFilePath))
    {
      var existingBook = DbContext?.Books.FirstOrDefault(b => b.Title == _book.Title);

      if (existingBook == null)
      {
        //huh
        QueuedTask.Message = "A book with matching title exist on file but not in database...";
        QueuedTask.Attempts = 3;
        return false;
      }
      
      currentUser.Books.Add(existingBook);
      QueuedTask.Message = "A book with a matching hash was found. Adding a link between the book and the current user.";

      try
      {
        DbContext?.SaveChanges();
      }
      catch (Exception e)
      {
        QueuedTask.Message = "Failed to link existing book with user. Got error: " + e.Message;
        return false;
      }
      return true;
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
    currentUser.Books.Add(_book);

    DbContext?.Books.Add(_book);
    
    // Add authors

    foreach (var authorString in authors)
    {
      var bookAuthor = FetchAuthor(authorString);
      
      _book.Authors.Add(bookAuthor);
    }
    
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

  private Author FetchAuthor(string authorName)
  {
    var author = DbContext?.Authors.FirstOrDefault(a => a.Name == authorName);

    if (author == null)
    {
      author = new Author();

      author.Name = authorName;
    }

    return author;
  }

  protected override void PostProcess()
  {
    if (EpubTempPath == null || !File.Exists(EpubTempPath))
    {
      return;
    }
    File.Delete(EpubTempPath);
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