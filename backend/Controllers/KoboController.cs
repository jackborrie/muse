using System.Net.Http.Headers;
using System.Text;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;

namespace backend.Controllers
{
    [ApiController]
    [Route("v1")]
    public class KoboController : ControllerBase
    {
        private readonly string _koboStoreUrl = "https://storeapi.kobo.com"; 
        
        private readonly ILogger<KoboController> _logger;
        private readonly MuseContext _context;

        public KoboController(ILogger<KoboController> logger, MuseContext context)
        {
            _logger = logger;
            _context = context;
        }
        
        [HttpGet("library/sync")]
        public async Task<ActionResult> HandleSync()
        {
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
            var key = Request.Headers["X-Kobo-userkey"];
            // Might be one to override.
            
            return await KoboRedirect("v1/analytics/gettests");
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
                return Redirect(_koboStoreUrl + url);
            }

            return await MakeRequestToKoboStore(url);

            return Ok();
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
            
            using (var requestMessage = new HttpRequestMessage(method, _koboStoreUrl + url))
            {
                Copy(requestMessage.Headers, headers);
                
                var bodyStr = "";
                using (StreamReader reader = new StreamReader(Request.Body, Encoding.UTF8, true, 1024, true))
                {
                    bodyStr = await reader.ReadToEndAsync();
                }

                requestMessage.Content = new StringContent(bodyStr);

                result = await httpClient.SendAsync(requestMessage);
            }

            _logger.LogInformation(result.ToString());
            
            return Ok();
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
