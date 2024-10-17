using System.ComponentModel.DataAnnotations.Schema;
using System.Net;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using backend.Models;
using backend.Services;
using backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Primitives;
using shared.models;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/kobo")]
    public class KoboController : ControllerBase
    {
        private readonly string _koboStoreUrl = "https://storeapi.kobo.com"; 
        
        private readonly ILogger<KoboController> _logger;
        private readonly MuseContext _context;

        private IClientService _clientService;

        public KoboController(ILogger<KoboController> logger, MuseContext context, ClientService clientService)
        {
            _logger = logger;
            _context = context;
            _clientService = clientService;
        }

        [HttpPost]
        public async Task<ActionResult> CreateKobo([FromBody]JsonObject data)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return Unauthorized();
            }

            var user = _context.Users.SingleOrDefault(u => u.Id == userId);

            if (user == null)
            {
                return Unauthorized();
            }
            
            var collectionId = (string?)data["collectionId"];
            Collection? collection = null;

            if (!string.IsNullOrEmpty(collectionId))
            {
                collection = _context.Collections.SingleOrDefault(c => c.UserId == userId && c.Id == collectionId);

                if (collection == null)
                {
                    return BadRequest();
                }
            }

            var name = (string?)data["name"];
            var getPublic = (bool?)data["getPublic"];
            
            if (string.IsNullOrEmpty(name))
            {
                return BadRequest();
            }
            
            var kobo = new Kobo();

            kobo.UserId = userId;
            kobo.Name = name; 

            if (getPublic.HasValue)
            {
                kobo.GetPublic = getPublic.Value;
            }
            
            user.Kobos.Add(kobo);

            if (collection != null)
            {
                collection.Kobos.Add(kobo);
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return Problem(ex.ToString());
            }

            return Ok(kobo);
        }
        
        [ApiExplorerSettings(IgnoreApi=true)]
        [Route("ws")]
        public async Task GetKoboInfo()
        {
            if (!HttpContext.WebSockets.IsWebSocketRequest)
            {
                HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
            }

            using var ws = await HttpContext.WebSockets.AcceptWebSocketAsync();

            await _clientService.HandleWebSocketConnection(ws);
        }

        [HttpGet]
        public async Task<ActionResult> GetAllUserKobos()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return Unauthorized();
            }
            
            var user = _context.Users.Include(user => user.Kobos).SingleOrDefault(u => u.Id == userId);

            if (user == null)
            {
                return Unauthorized();
            }

            var filteredData = new FilteredData<Kobo>();

            filteredData.TotalPages = user.Kobos.Count;
            filteredData.Data = user.Kobos;

            return Ok(filteredData);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateKobo(string id, [FromBody]JsonObject data)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return Unauthorized();
            }
            
            var user = _context.Users.Include(user => user.Kobos).SingleOrDefault(u => u.Id == userId);

            if (user == null)
            {
                return Unauthorized();
            }

            if (string.IsNullOrEmpty(id))
            {
                return BadRequest();
            }

            var kobo = _context.Kobos.Include(k => k.Collection).SingleOrDefault(u => u.Id == id && u.UserId == userId);

            if (kobo == null)
            {
                return BadRequest();
            }
            
            var collectionId = (string?)data["collectionId"];
            Collection? collection = null;

            if (kobo.CollectionId != collectionId)
            {
                var existingCollection = kobo.Collection;
                if (string.IsNullOrEmpty(collectionId))
                {
                    if (existingCollection != null)
                    {
                        existingCollection.Kobos.Remove(kobo);
                    }
                }
                else
                {
                    var newCollection = _context.Collections.SingleOrDefault(c => c.UserId == userId && c.Id == collectionId);

                    if (newCollection == null)
                    {
                        return BadRequest();
                    }
                    
                    if (existingCollection != null)
                    {
                        existingCollection.Kobos.Remove(kobo);
                    }

                    collection = newCollection;
                }
            }

            
            var name = (string?)data["name"];
            var getPublic = (bool?)data["getPublic"];

            if (!string.IsNullOrEmpty(name))
            {
                kobo.Name = name;
            }

            if (getPublic.HasValue)
            {
                kobo.GetPublic = getPublic.Value;
            }

            if (collection != null)
            {
                collection.Kobos.Add(kobo);
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return Problem(ex.ToString());
            }

            return Ok(kobo);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteKobo(string id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return Unauthorized();
            }
            
            var user = _context.Users.Include(user => user.Kobos).SingleOrDefault(u => u.Id == userId);

            if (user == null)
            {
                return Unauthorized();
            }

            if (string.IsNullOrEmpty(id))
            {
                return BadRequest();
            }

            var kobo = _context.Kobos.SingleOrDefault(u => u.Id == id && u.UserId == userId);

            if (kobo == null)
            {
                return BadRequest();
            }

            _context.Kobos.Remove(kobo);
            
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return Problem(ex.ToString());
            }

            return Ok();
        }

        [HttpPost("{id}/message")]
        public async Task<ActionResult> SendMessage(string id, [FromBody] JsonObject data)
        {
            
            if (string.IsNullOrEmpty(id))
            {
                return BadRequest();
            }

            var kobo = _context.Kobos.SingleOrDefault(k => k.Id == id);

            if (kobo == null)
            {
                return BadRequest();
            }
            
            var message = (string?)data["message"];

            if (string.IsNullOrEmpty(message) || kobo.UserId == null)
            {
                return BadRequest();
            }

            await _clientService.SendMessageToUserSockets(kobo.UserId, message);

            return Ok();
        }

        [HttpGet("{id}/books")]
        public async Task<ActionResult> GetKoboBooks(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return BadRequest();
            }

            var kobo = _context.Kobos.Include(k => k.Collection).SingleOrDefault(k => k.Id == id);

            if (kobo == null)
            {
                return BadRequest();
            }

            IQueryable<Book>? books = null;

            var collection = kobo.Collection;

            if (collection != null)
            {
                books = _context.Books.Where(b => b.Collections.Contains(collection));
            }
            
            if (kobo.GetPublic)
            {
                var publicBooks = _context.Books.Where(b => b.Public);
                books = books != null ? publicBooks.Union(books) : publicBooks;
            }

            if (books == null)
            {
                return Ok(new List<Book>());
            }

            return Ok(books.ToList());
        }
        
        [HttpGet("library/sync")]
        public async Task<ActionResult> HandleSync()
        {
            
            var headers = Request.Headers;
            
            // Response.Headers.Append("x-kobo-sync", "continue");
            
            return await KoboRedirect("v1/library/sync");
        }

        [HttpGet("affiliate")]
        [HttpPost("affiliate")]
        public async Task<ActionResult> HandleAffiliate()
        {
            return await KoboRedirect("v1/affiliate");
        }

        [HttpGet("analytics/gettests")]
        [HttpPost("analytics/gettests")]
        public async Task<ActionResult> HandleGetTests()
        {
            
            _logger.LogInformation($"Get tests started");
            var key = Request.Headers["X-Kobo-userkey"];
            // Might be one to override.

            var output = new KoboTests()
            {
                Results = "Success",
                TestKey = string.IsNullOrEmpty(key) ? "" : key.ToString(),
                Tests = []
            };
            _logger.LogInformation($"Get tests ended");


            // return await KoboRedirect("v1/analytics/gettests");

            return Ok(output);
        }


        [HttpGet("deals")]
        [HttpPost("deals")]
        public async Task<ActionResult> HandleDeals()
        {
            return await KoboRedirect("v1/deals");
        }

        [HttpGet("user/loyalty/benefits")]
        public async Task<ActionResult> HandleLoyaltyBenefits()
        {
            return await KoboRedirect("user/loyalty/benefits");
        }

        [HttpPost("auth/device")]
        public async Task<ActionResult> HandleAuthDevice([FromBody] Dictionary<string, object>  content)
        {
            var userKey = content["UserKey"].ToString();

            if (userKey == null)
            {
                return await KoboRedirect("v1/auth/device");
            }

            var accessToken = this.Base64Decode(this.Base64Encode("123456789098765432123456"));
            var refreshToken = this.Base64Decode(this.Base64Encode("123456789098765432123456"));

            var koboData = new KoboAuthModel();
            
            koboData.UserKey = userKey;
            koboData.AccessToken = accessToken;
            koboData.RefreshToken = refreshToken;
            koboData.TrackingId = "18acac20-991e-437e-9529-a441452f6b7e";
            
            return Ok(koboData);
        }
        
        //user/profile
        
        [Route("{**catchAll}")]
        [HttpPost]
        [HttpGet]
        [HttpPut]
        [HttpDelete]
        public async Task<IActionResult> CatchAll(string catchAll)
        {
            return await KoboRedirect("v1/" + catchAll);
        }

        private async Task<ActionResult> KoboRedirect(string url)
        {
            var method = Request.Method;
            
            _logger.LogInformation($"Unimplemented [{method}] method called: {url}");

            if (method == "GET")
            {
                return Redirect(_koboStoreUrl + "/" + url);
            }

            return await MakeRequestToKoboStore(url);
        }
        
        private string Base64Encode(string plainText) 
        {
            var plainTextBytes = System.Text.Encoding.UTF8.GetBytes(plainText);
            return System.Convert.ToBase64String(plainTextBytes);
        }
        
        private string Base64Decode(string base64EncodedData) 
        {
            var base64EncodedBytes = System.Convert.FromBase64String(base64EncodedData);
            return System.Text.Encoding.UTF8.GetString(base64EncodedBytes);
        }

        private async Task<ActionResult> MakeRequestToKoboStore(string url)
        {
            var headers = Request.Headers;
            headers.Remove("Host");

            var client = new HttpClient();

            HttpMethod? method = null;

            switch (Request.Method)
            {
                case "DELETE":
                    method = HttpMethod.Delete;
                    break;
                case "PUT":
                    method = HttpMethod.Put;
                    break;
                case "POST":
                    method = HttpMethod.Post;
                    break;
                default:
                    break;
            }

            if (method == null)
            {
                return BadRequest();
            }

            var httpClient = new HttpClient();
            HttpResponseMessage? result = null;
            
            using (var requestMessage = new HttpRequestMessage(method, _koboStoreUrl + "/" + url))
            {
                Copy(requestMessage.Headers, headers);
                
                var bodyStr = "";
                using (StreamReader reader = new StreamReader(Request.Body, Encoding.UTF8, true, 1024, true))
                {
                    bodyStr = await reader.ReadToEndAsync();
                }

                requestMessage.Content = new StringContent(bodyStr);

                try
                {
                    result = await httpClient.SendAsync(requestMessage);
                }
                catch (Exception ex)
                {
                    _logger.LogError("Failed to redirect unknown route... " + ex.ToString());
                }
            }

            var json = JsonSerializer.Serialize(result.Content);
            _logger.LogError(json);
            
            return Ok(json);
        }
        
        private void Copy<T, U>(IEnumerable<KeyValuePair<string, T>>? from, IEnumerable<KeyValuePair<string, U>>? to)
            where T : IEnumerable<string>
            where U : IEnumerable<string>
        {
            if (from == null || to == null)
            {
                return;
            }

            if (to is IHeaderDictionary headerDictionary)
            {
                foreach (var x in from)
                {
                    headerDictionary.Add(x.Key, new StringValues(x.Value.ToArray()));
                }
            }
            else if (to is HttpHeaders httpHeaders)
            {
                foreach (var x in from)
                {
                    httpHeaders.Add(x.Key, new List<string?>(x.Value));
                }
            }
        }
        
        /* To Document */
        
        /*
         * Important routes:
         * "/"
         * /v1/affiliate
         * /v1/initialization
         * /v1/user/profile
         * /v1/user/loyalty/benefits
         * /v1/deals
         * /v1/analytics/gettests
         */
        
        /*
         * @kobo.route("/v1/library/sync")
         * @kobo.route("/v1/library/<book_uuid>/metadata")
         * @kobo.route("/v1/library/tags", methods=["POST", "DELETE"])
         * @kobo.route("/v1/library/tags/<tag_id>", methods=["DELETE", "PUT"])
         * @kobo.route("/v1/library/tags/<tag_id>/items", methods=["POST"])
         * @kobo.route("/v1/library/tags/<tag_id>/items/delete", methods=["POST"])
         * @kobo.route("/v1/library/<book_uuid>/state", methods=["GET", "PUT"])
         * @kobo.route("/<book_uuid>/<width>/<height>/<isGreyscale>/image.jpg", defaults={'Quality': ""})
         * @kobo.route("/<book_uuid>/<width>/<height>/<Quality>/<isGreyscale>/image.jpg")
         * @kobo.route("")
         * @kobo.route("/v1/library/<book_uuid>", methods=["DELETE"])
         * @kobo.route("/v1/library/<dummy>", methods=["DELETE", "GET"])
         * @kobo.route("/v1/user/loyalty/<dummy>", methods=["GET", "POST"])
         * @kobo.route("/v1/user/profile", methods=["GET", "POST"])
         * @kobo.route("/v1/user/wishlist", methods=["GET", "POST"])
         * @kobo.route("/v1/user/recommendations", methods=["GET", "POST"])
         * @kobo.route("/v1/analytics/<dummy>", methods=["GET", "POST"])
         * @kobo.route("/v1/assets", methods=["GET"])
         * @kobo.route("/v1/user/loyalty/benefits", methods=["GET"])
         * @kobo.route("/v1/analytics/gettests", methods=["GET", "POST"])
         * @kobo.route("/v1/products/<dummy>/prices", methods=["GET", "POST"])
         * @kobo.route("/v1/products/<dummy>/recommendations", methods=["GET", "POST"])
         * @kobo.route("/v1/products/<dummy>/nextread", methods=["GET", "POST"])
           @kobo.route("/v1/products/<dummy>/reviews", methods=["GET", "POST"])
           @kobo.route("/v1/products/featured/<dummy>", methods=["GET", "POST"])
           @kobo.route("/v1/products/featured/", methods=["GET", "POST"])
           @kobo.route("/v1/products/books/external/<dummy>", methods=["GET", "POST"])
           @kobo.route("/v1/products/books/series/<dummy>", methods=["GET", "POST"])
           @kobo.route("/v1/products/books/<dummy>", methods=["GET", "POST"])
           @kobo.route("/v1/products/books/<dummy>/", methods=["GET", "POST"])
           @kobo.route("/v1/products/dailydeal", methods=["GET", "POST"])
           @kobo.route("/v1/products/deals", methods=["GET", "POST"])
           @kobo.route("/v1/products", methods=["GET", "POST"])
           @kobo.route("/v1/affiliate", methods=["GET", "POST"])
           @kobo.route("/v1/deals", methods=["GET", "POST"])
           @kobo.route("/v1/auth/device", methods=["POST"])
           @kobo.route("/v1/initialization")
           @kobo.route("/download/<book_id>/<book_format>")
         */
    }
}
