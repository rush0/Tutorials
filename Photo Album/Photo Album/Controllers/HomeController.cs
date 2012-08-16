using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Photo_Album.Models;

namespace Photo_Album.Controllers
{
    public class HomeController : Controller
    {
        private PhotoEntities db = new PhotoEntities();

        //
        // GET: /Home/

        public ActionResult Index()
        {
            var defaultAlbum = db.Photos.Where( p => p.album == "Bikes" );
            return View(defaultAlbum);
        }

    }
}
