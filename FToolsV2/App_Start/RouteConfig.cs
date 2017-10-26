using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace FToolsV2
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "Chat",
                url: "chat.html",
                defaults: new { controller = "Home", action = "Chat", ids = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "CMS",
                url: "cms.html",
                defaults: new { controller = "Home", action = "CMS", ids = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "CMSLite",
                url: "cms-lite.html",
                defaults: new { controller = "Home", action = "CMSLite", ids = UrlParameter.Optional }
            );

            routes.MapRoute(
               name: "Login",
               url: "login.html",
               defaults: new { controller = "Home", action = "Login", hash = UrlParameter.Optional, time = UrlParameter.Optional }
           );

            routes.MapRoute(
                name: "RouteHomeIndex",
                url: "index.html",
                defaults: new { controller = "LandingPage", action = "Index" }
            );

            routes.MapRoute(
                name: "RouteDetailPage",
                url: "detail/{id}/page.html",
                defaults: new { controller = "Home", action = "DetailPage" }
            );

            routes.MapRoute(
                name: "RouteAllPage",
                url: "allpage.html",
                defaults: new { controller = "Home", action = "AllPage" }
            );

            routes.MapRoute(
                name: "RouteAllPageIncrease",
                url: "increase-page.html",
                defaults: new { controller = "Home", action = "IncreasePage" }
            );

            routes.MapRoute(
                name: "RouteDetailGroupPage",
                url: "detail/{id}/group.html",
                defaults: new { controller = "Home", action = "DetailGroup" }
            );

            routes.MapRoute(
                name: "RouteAllGroup",
                url: "allgroup.html",
                defaults: new { controller = "Home", action = "AllGroup" }
            );

            routes.MapRoute(
                name: "DashboardPage",
                url: "dashboard.html",
                defaults: new { controller = "Home", action = "Dashboard" }
            );

            routes.MapRoute(
                name: "SearchPage",
                url: "search.html",
                defaults: new { controller = "Home", action = "Search" }
            );

            routes.MapRoute(
                name: "Logout",
                url: "logout.html",
                defaults: new { controller = "Home", action = "Logout" }
            );

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "LandingPage", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}
