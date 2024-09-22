using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using shared.models;

namespace backend.Controllers;

[ApiController]
[Route("api/collections")]
public class CollectionController : ControllerBase
{
    
    private readonly ILogger<CollectionController> _logger;
    private readonly MuseContext _context;

    public CollectionController(ILogger<CollectionController> logger, MuseContext context)
    {
        _logger = logger;
        _context = context;
    }

    [HttpGet]
    public ActionResult<FilteredData<Collection>> GetAll([FromQuery] string? searchTerm, [FromQuery] int? pageSize, [FromQuery] string? sortBy, [FromQuery] string? sortDirection, [FromQuery] int page = 0)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
        {
            return Unauthorized();
        }

        var userCollections = _context.Collections.Where(ub => ub.UserId == userId);

        var total = userCollections.Count();
        var filtered = new FilteredData<Collection>();
        if (pageSize.HasValue)
        {
            userCollections = userCollections.Skip(page * pageSize.Value).Take(pageSize.Value);

            var pages = total / (decimal)pageSize.Value;
            var totalPages = Math.Ceiling(pages);
            
            filtered.TotalPages = (int)totalPages;
        }
        else
        {
            filtered.TotalPages = 1;
        }

        filtered.Data = userCollections.ToList();

        return filtered;
    }

    [HttpPost]
    public async Task<ActionResult<Collection>> CreateCollection([FromBody] string collectionName)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
        {
            return Unauthorized();
        }

        var collection = new Collection();

        collection.UserId = userId;
        collection.Name = collectionName;

        _context.Collections.Add(collection);

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            return Problem(ex.ToString());
        }

        return Ok(collection);
    }
}