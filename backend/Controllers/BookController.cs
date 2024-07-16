using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using shared.models.data;
using task_runner.models;

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
    public ActionResult Upload(IFormFile file)
    {
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
            using var stream = new FileStream(Path.Combine(Directory.GetCurrentDirectory(), filePath), FileMode.Create);
            file.CopyTo(stream);
        }
        catch (IOException)
        {
            return Problem("Error saving book to temp dir.");
        }

        var importTask = new QueuedTask();

        var importData = new BookImportData();
        importData.FileName = fileName;
        
        importTask.Function = TaskFunction.importBook;
        
        var options = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower
        };
        
        importTask.Data = JsonSerializer.Serialize(importData, options);

        _context.Tasks.Add(importTask);
        _context.SaveChanges();
        
        return Ok();
    }
}