using System.Security.Claims;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using shared.models;

namespace backend.Controllers;

[ApiController]
[Route("api/authentication")]
public class AuthenticationController : ControllerBase
{
    
    private readonly ILogger<AuthenticationController> _logger;
    private readonly MuseContext _context;

    public AuthenticationController(ILogger<AuthenticationController> logger, MuseContext context)
    {
        _logger = logger;
        _context = context;
    }

    [HttpGet("socket")]
    public ActionResult GetSocketToken()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
        {
            return Unauthorized();
        }

        var user = _context.Users.SingleOrDefault(u => u.Id == userId);

        if (user == null)
        {
            return BadRequest();
        }
        
        var token =  Guid.NewGuid().ToString();

        user.WebSocketToken = token;

        try
        {
            _context.SaveChanges();
        }
        catch (Exception ex)
        {
            return Problem(ex.ToString());
        }

        var s = new WebsocketToken();

        s.Token = token;
        
        return Ok(s);
    }
}