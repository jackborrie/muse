using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using shared.models;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/themes")]
    public class ThemeController : ControllerBase
    {

        private readonly ILogger<ThemeController> _logger;
        private readonly MuseContext _context;

        public ThemeController(ILogger<ThemeController> logger, MuseContext context)
        {
            _logger = logger;
            _context = context;
        }
        
        [HttpPost]
        public ActionResult<Theme> Create(Theme data)
        {
            var theme = new Theme
            {
                Name = data.Name,
                ClassName = data.ClassName,
                Style = data.Style
            };

             _context.Themes.Add(theme);

            _context.SaveChanges();
            
            return theme;
        }
        
        [HttpGet]
        public ActionResult<FilteredData<Theme>> GetAll()
        {
            var themes = _context.Themes.OrderBy(t => t.Name).ToList();

            var output = new FilteredData<Theme>();

            output.Data = themes;
            
            return output;
        }
        
        [HttpGet("{id}")]
        public ActionResult<Theme> GetOne(string? id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return BadRequest("An id must be set in order to fetch theme");
            }

            var theme = _context.Themes.FirstOrDefault(t => t.Id == id);

            if (theme == null)
            {
                return BadRequest("A valid id must be provided");
            }
            
            return theme;
        }
        
        [HttpPut("{id}")]
        public ActionResult<Theme> Update(string? id, Theme data)
        {
            if (string.IsNullOrEmpty(id))
            {
                return BadRequest("An id must be set in order to update theme");
            }

            var theme = _context.Themes.FirstOrDefault(c => c.Id == id);

            if (theme == null)
            {
                return BadRequest("A valid id must be provided");
            }

            theme.Name = data.Name;
            theme.ClassName = data.ClassName;
            theme.Style = data.Style;

            _context.SaveChanges();
            
            return theme;
        }
        
        [HttpDelete("{id}")]
        public ActionResult<Theme> Delete(string? id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return BadRequest("An id must be set in order to delete theme");
            }

            var theme = _context.Themes.FirstOrDefault(c => c.Id == id);

            if (theme == null)
            {
                return BadRequest("A valid id must be provided");
            }

            _context.Themes.Remove(theme);
            
            _context.SaveChanges();
            
            return theme;
        }
    }
}
