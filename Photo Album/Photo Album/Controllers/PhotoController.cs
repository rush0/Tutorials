using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Photo_Album.Models;

namespace Photo_Album.Controllers
{ 
    public class PhotoController : Controller
    {
        private PhotoEntities db = new PhotoEntities();

        //
        // GET: /Photo/

        public ViewResult Index()
        {
            return View(db.Photos.ToList());
        }

        //
        // GET: /Photo/Details/5

        public ViewResult Details(int id)
        {
            Photo photo = db.Photos.Find(id);
            return View(photo);
        }

        //
        // GET: /Photo/Create

        public ActionResult Create()
        {
            return View();
        } 

        //
        // POST: /Photo/Create

        [HttpPost]
        public ActionResult Create(Photo photo)
        {
            if (ModelState.IsValid)
            {
                db.Photos.Add(photo);
                db.SaveChanges();
                return RedirectToAction("Index");  
            }

            return View(photo);
        }
        
        //
        // GET: /Photo/Edit/5
 
        public ActionResult Edit(int id)
        {
            Photo photo = db.Photos.Find(id);
            return View(photo);
        }

        //
        // POST: /Photo/Edit/5

        [HttpPost]
        public ActionResult Edit(Photo photo)
        {
            if (ModelState.IsValid)
            {
                db.Entry(photo).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(photo);
        }

        //
        // GET: /Photo/Delete/5
 
        public ActionResult Delete(int id)
        {
            Photo photo = db.Photos.Find(id);
            return View(photo);
        }

        //
        // POST: /Photo/Delete/5

        [HttpPost, ActionName("Delete")]
        public ActionResult DeleteConfirmed(int id)
        {            
            Photo photo = db.Photos.Find(id);
            db.Photos.Remove(photo);
            db.SaveChanges();
            return RedirectToAction("Index");
        }

        protected override void Dispose(bool disposing)
        {
            db.Dispose();
            base.Dispose(disposing);
        }
    }
}