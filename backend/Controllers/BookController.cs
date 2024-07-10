using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/books")]
public class BookController
{

    private readonly ILogger<BookController> _logger;
    private readonly MuseContext _context;

    public BookController(ILogger<BookController> logger, MuseContext context)
    {
        _logger = logger;
        _context = context;
    }
}