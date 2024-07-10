using backend.models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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
        public ActionResult<string> HandleSync(string authToken)
        {
            return "hello";
        }

        [HttpGet("affiliate")]
        public ActionResult HandleAffiliate()
        {
            return Redirect(_koboStoreUrl + "v1/affiliate");
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
