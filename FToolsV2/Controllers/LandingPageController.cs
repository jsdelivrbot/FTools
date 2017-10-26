using FToolsV2.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FToolsV2.Controllers
{
    public class LandingPageController : Controller
    {
        //
        // GET: /LandingPage/

        [SessionAuthorizeAttribute]
        public ActionResult Index()
        {
            bool isDebug = Boolean.Parse(ConfigurationManager.AppSettings["IsDebug"].ToString());
            if (isDebug)
                Session["FBAppId"] = "313601012371988";
            else
                Session["FBAppId"] = "666609246841212";

            Session["Lang"] = "vi_VN";
            ViewBag.FBAppId = Session["FBAppId"].ToString();
            ViewBag.FacebookUserId = Session["FacebookUserId"] != null ? "'" + Session["FacebookUserId"].ToString() + "'" : "''";
            ViewBag.Group = Session["Group"] != null ? "'" + Session["Group"].ToString() + "'" : "''";
            ViewBag.IsLogged = Session["EmployeeId"] != null ? 1 : 0;
            return View();
        }

    }
}
