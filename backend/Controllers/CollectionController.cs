using System.Security.Cryptography;
using backend.models;
using Microsoft.AspNetCore.Mvc;

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
    public ActionResult<FilteredData<Collection>> GetAll()
    {
        var collections = _context.Collections.ToList();

        var filteredData = new FilteredData<Collection>();
        filteredData.Data = collections;
        filteredData.TotalPages = 1;

        return filteredData;
    }
}