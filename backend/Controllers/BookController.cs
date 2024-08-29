using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using shared.models;
using shared.models.data;

namespace backend.Controllers;

[ApiController]
[Route("api/books")]
public class BookController : ControllerBase
{

    private readonly ILogger<BookController> _logger;
    private readonly MuseContext _context;
    private readonly IConfiguration _configuration;

    public BookController(ILogger<BookController> logger, MuseContext context, IConfiguration configuration)
    {
        _logger = logger;
        _context = context;
        _configuration = configuration;
    }
    
    [HttpPost]
    // [Authorize]
    public ActionResult Upload(IFormFile file)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
        {
            return Unauthorized();
        }
        
        var tempDir = _configuration.GetValue<string>("TempEpubDir");

        if (string.IsNullOrEmpty(tempDir))
        {
            return Problem("Temp directory not set, can't store new books");
        }
        
        
        // File extension check
        var extension = Path.GetExtension(file.FileName);

        if (extension != ".epub")
        {
            return BadRequest("Invalid file type.");
        }

        long size = file.Length;

        if (size > (100 * 1024 * 1024))
        {
            return BadRequest("File size too large.");
        }

        var now = DateTime.Now;

        var fileName = now.ToString("yyyyMMddhhmmss-") + file.FileName;
        
        var filePath = Path.Combine(tempDir, fileName);

        if (System.IO.File.Exists(filePath))
        {
            return BadRequest("A temp file with that name already exists.");
        }
        
        try
        {
            using var stream = new FileStream(filePath, FileMode.Create);
            file.CopyTo(stream);
        }
        catch (IOException)
        {
            return Problem("Error saving book to temp dir.");
        }

        var importTask = new QueuedTask();

        var importData = new BookImportData();
        importData.FileName = fileName;
        
        importTask.Function = TaskFunction.ImportBook;
        
        var options = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower
        };

        importTask.UserId = userId;
        importTask.Data = JsonSerializer.Serialize(importData, options);

        _context.Tasks.Add(importTask);
        _context.SaveChanges();
        
        return Ok();
    }

    [HttpGet]
    public async Task<ActionResult<FilteredData<Book>>> GetAllBooks([FromQuery] string? searchTerm, [FromQuery] int? pageSize, [FromQuery] string? sortBy, [FromQuery] string? sortDirection, [FromQuery] int page = 0)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
        {
            return Unauthorized();
        }

        var userBooks = _context.UserBooks.Where(ub => ub.UserId == userId);

        var total = userBooks.Count();
        var filtered = new FilteredData<Book>();
        
        if (pageSize.HasValue)
        {
            // Paginate
            userBooks = userBooks.Skip(page * pageSize.Value).Take(pageSize.Value);
            filtered.TotalPages = total / pageSize.Value;
        }
        else
        {
            filtered.TotalPages = 1;
        }

        filtered.Data = await GetBooksFromUserBooks(userBooks);
        
        return filtered;
    }

    [HttpDelete("{bookId}")]
    public ActionResult<Book> Delete(string bookId)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
        {
            return Unauthorized();
        }
        
        if (bookId == null)
        {
            return BadRequest("A book id is required in order to delete a book.");
        }

        var book = _context.Books.FirstOrDefault(b => b.Id == bookId);

        if (book == null)
        {
            return BadRequest("Invalid book id");
        }

        var bookLink = _context.UserBooks.FirstOrDefault(ub => ub.UserId == userId && ub.BookId == bookId);

        if (bookLink == null)
        {
            return BadRequest($"User isn't assigned to book with book id [{bookId}]");
        }

        _context.UserBooks.Remove(bookLink);

        try
        {
            _context.SaveChanges();
        }
        catch (Exception ex)
        {
            return Problem("Unable to delete book: " + ex);
        }

        var allBookLinks = _context.UserBooks.Where(ub => ub.BookId == bookId);

        if (allBookLinks.Any())
        {
            return book;
        }
        
        var importTask = new QueuedTask();

        var importData = new BookDeleteData();
        importData.BookId = bookId;
        
        importTask.Function = TaskFunction.DeleteBook;
        
        var options = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower
        };

        importTask.UserId = userId;
        importTask.Data = JsonSerializer.Serialize(importData, options);

        _context.Tasks.Add(importTask);
        _context.SaveChanges();
        
        return book;
    }

    private async Task<List<Book>> GetBooksFromUserBooks(IQueryable<UserBook> ub)
    {
        var books = new List<Book>();

        foreach (var userBook in ub.ToArray())
        {
            if (userBook.BookId == null)
            {
                continue;
            }

            var book = await _context.Books.FirstOrDefaultAsync(b => b.Id == userBook.BookId);

            if (book == null)
            {
                continue;
            }

            book.CreationDate = userBook.CreationDate;
            
            books.Add((Book)book);
        }

        return books;
    }
}