using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FToolsV2.Models;
using RestSharp;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using log4net;

namespace FToolsV2.Controllers
{
    public class HomeController : Controller
    {
        private static readonly ILog log = LogMaster.GetLogger("ftool", "ftool");
        private static readonly bool isLocalDebug = Boolean.Parse(ConfigurationManager.AppSettings["IsDebug"].ToString());

        [SessionAuthorizeAttribute]
        public ActionResult Dashboard()
        {
            if (Session["EmployeeId"] != null)
            {
                ViewBag.UserId = Session["EmployeeId"].ToString();
                ViewBag.UserFacebookToken = Session["UserFacebookToken"]!=null ? Session["UserFacebookToken"].ToString() : "";
                return View();
            }
            else
            {
                return RedirectToRoute("RouteHomeIndex");
            }
            
        }

        [SessionAuthorizeAttribute]
        public ActionResult Search()
        {
            return View();
        }


        [SessionAuthorizeAttribute]
        public ActionResult DetailPage(string id)
        {

            bool isDebug = Boolean.Parse(ConfigurationManager.AppSettings["IsDebug"].ToString());
            if (isDebug)
                Session["FBAppId"] = "533964243456544";
            else
                Session["FBAppId"] = "666609246841212";

            Session["Lang"] = "vi_VN";
            ViewBag.FBAppId = Session["FBAppId"].ToString();
            ViewBag.FacebookUserId = Session["FacebookUserId"] != null ? "'" + Session["FacebookUserId"].ToString() + "'" : "''";
            ViewBag.Group = Session["Group"] != null ? "'" + Session["Group"].ToString() + "'" : "''";
            ViewBag.IsLogged = Session["EmployeeId"] != null ? 1 : 0;

            ViewBag.PageId = "'" + id + "'";
            //ViewBag.UserId = Session["UserId"].ToString();
            return View();
        }

        [SessionAuthorizeAttribute]
        public ActionResult AllPage()
        {
            return View();
        }

        [SessionAuthorizeAttribute]
        public ActionResult IncreasePage()
        {
            return View();
        }


        [SessionAuthorizeAttribute]
        public ActionResult DetailGroup(string id)
        {

            bool isDebug = Boolean.Parse(ConfigurationManager.AppSettings["IsDebug"].ToString());
            if (isDebug)
                Session["FBAppId"] = "313601012371988";
            else
                Session["FBAppId"] = "666609246841212";

            Session["Lang"] = "vi_VN";
            ViewBag.FBAppId = Session["FBAppId"].ToString();
            ViewBag.FacebookUserId = Session["FacebookUserId"] != null ? "'" + Session["FacebookUserId"].ToString() + "'" : "''";
            ViewBag.UserFacebookToken = Session["UserFacebookToken"] != null ? "'" + Session["UserFacebookToken"].ToString() + "'" : "''";
            ViewBag.UserId = Session["EmployeeId"] != null ? "'" + Session["EmployeeId"].ToString() + "'" : "''";

            //ViewBag.Group = Session["Group"] != null ? "'" + Session["Group"].ToString() + "'" : "''";
            //ViewBag.IsLogged = Session["EmployeeId"] != null ? 1 : 0;

            //if (Session["UserFacebookToken"] != null)
            //{
            //    ViewBag.UserId = Session["UserId"].ToString();
            //    ViewBag.UserFacebookToken = Session["UserFacebookToken"].ToString();
            //    string uid = Session["UserId"].ToString();
            //    string token = Session["UserFacebookToken"].ToString();
            //}
            //else
            //{
            //    ViewBag.UserId = "";
            //    ViewBag.UserFacebookToken = "";
            //}
            ViewBag.GroupId = "'" + id + "'";
            return View();
        }

        [SessionAuthorizeAttribute]
        public ActionResult AllGroup()
        {
            return View();
        }

        //[SessionAuthorizeAttribute]
        public ActionResult Chat(string ids)
        {
            //
            DateTime now = DateTime.Now;
            int unix = (int)now.Subtract(new DateTime(1970, 1, 1)).TotalSeconds;
            if (ids != null && ids != "")
                Session["ids"] = ids;
            string input = "fb.sale|" + Session["temp_Email"].ToString() + "|" + Session["temp_Password"].ToString();//+ "|" + ids + "|" + unix;
            if (Session["ids"] != null)
                input += "|" + Session["ids"].ToString();
            else
                input += "|0";
            input += "|" + unix;
            string hash = Security.Encrypt("fbsale@!321", input);
            hash = HttpUtility.UrlEncode(hash);
            //if (Session["lang"] == null)
                Session["lang"] = "vi_VN";
            return Redirect("http://chat.fb.sale?hash=" + hash + "&time=" + unix + "&lang=" + Session["lang"].ToString());
        }

        //[SessionAuthorizeAttribute]
        public ActionResult CMS(string ids)
        {
            //
            DateTime now = DateTime.Now;
            int unix = (int)now.Subtract(new DateTime(1970, 1, 1)).TotalSeconds;
            if (ids != null && ids != "")
                Session["ids"] = ids;
            string input = "fb.sale|" + Session["temp_Email"].ToString() + "|" + Session["temp_Password"].ToString();//+ "|" + ids + "|" + unix;
            if (Session["ids"] != null)
                input += "|" + Session["ids"].ToString();
            else
                input += "|0";
            input += "|" + unix;
            string hash = Security.Encrypt("fbsale@!321", input);
            hash = HttpUtility.UrlEncode(hash);
            //if (Session["lang"] == null)
            //    Session["lang"] = "vi_VN";
            return Redirect("http://cms.fb.sale/login.html?hash=" + hash + "&time=" + unix + "&lang=" + Session["lang"].ToString());
        }

        //[SessionAuthorizeAttribute]
        public ActionResult CMSLite(string ids)
        {
            //
            DateTime now = DateTime.Now;
            int unix = (int)now.Subtract(new DateTime(1970, 1, 1)).TotalSeconds;
            if (ids != null && ids != "")
                Session["ids"] = ids;
            string input = "fb.sale|" + Session["temp_Email"].ToString() + "|" + Session["temp_Password"].ToString();//+ "|" + ids + "|" + unix;
            if (Session["ids"] != null)
                input += "|" + Session["ids"].ToString();
            else
                input += "|0";
            input += "|" + unix;
            string hash = Security.Encrypt("fbsale@!321", input);
            hash = HttpUtility.UrlEncode(hash);
            //if (Session["lang"] == null)
                Session["lang"] = "vi_VN";
            return Redirect("http://fb.sale/login.html?hash=" + hash + "&time=" + unix);
        }

        //[SessionAuthorizeAttribute]
        //public ActionResult Login(string hash, string time)
        //{
        //    //check if session is available
        //    if (Session["EmployeeId"] == null)
        //    {
        //        DateTime now = DateTime.Now;
        //        int unix = (int)now.Subtract(new DateTime(1970, 1, 1)).TotalSeconds;
        //        string s = Security.Decrypt("fbsale@!321", hash);
        //        string[] pieces = s.Split('|');
        //        string email = pieces[1];
        //        string password = pieces[2];
        //        LoginModel loginModel = new LoginModel();
        //        loginModel.email = email;
        //        loginModel.password = password;
        //        RestClient client = new RestClient(ConfigurationManager.AppSettings["fsaleApiUrl"].ToString());
        //        var request = new RestRequest("api/employees/login", Method.POST);
        //        request.AddJsonBody(loginModel);
        //        request.AddHeader("Content-Type", "application/json");
        //        IRestResponse response = client.Execute(request);
        //        var content = response.Content; // raw content as string
        //        JObject json = JObject.Parse(content);
        //        try
        //        {
        //            Session["UserId"] = json["data"]["UserId"].ToString();
        //            Session["EmployeeId"] = json["data"]["EmployeeId"].ToString();
        //            Session["EmployeeName"] = json["data"]["EmployeeName"].ToString();
        //            Session["ShopId"] = json["data"]["ShopId"].ToString();
        //            Session["ShopName"] = json["data"]["ShopName"].ToString();
        //            Session["BranchId"] = json["data"]["BranchId"].ToString();
        //            Session["Group"] = json["data"]["Group"].ToString();
        //            Session["FacebookUserId"] = json["data"]["FacebookUserId"].ToString();
        //            Session["IsTokenValid"] = false;
        //            Session["UserFacebookToken"] = null;
        //            Session["access_token"] = null;
        //            client = new RestClient(ConfigurationManager.AppSettings["fsaleApiUrl"].ToString());
        //            request = new RestRequest("api/security/token", Method.POST);
        //            request.AddParameter("grant_type", "password"); // adds to POST or URL querystring based on Method  
        //            request.AddParameter("userName", loginModel.email);
        //            request.AddParameter("password", loginModel.password);
        //            request.AddHeader("Content-Type", "application/x-www-form-urlencoded");
        //            response = client.Execute(request);
        //            content = response.Content; // raw content as string

        //            TokenResponse tokenResponse = JsonConvert.DeserializeObject<TokenResponse>(content);
        //            if (tokenResponse != null)
        //                if (tokenResponse.access_token != null)
        //                {
        //                    Session["access_token"] = tokenResponse.access_token;
        //                    Session["temp_Email"] = loginModel.email;
        //                    Session["temp_Password"] = loginModel.password;
        //                }
        //        }
        //        catch (Exception ex)
        //        { }
        //        return RedirectToAction("Dashboard");
        //    }
        //    else
        //        return RedirectToAction("Dashboard");
        //}

        public ActionResult Login()
        {
            var context = Request.Cookies["access_token"];
            if (context != null)
            {
                var password = Security.getMd5("banhang1@yahoo.com");
                LoginModel loginModel = new LoginModel();
                loginModel.email = "banhang1@yahoo.com";
                loginModel.password = password;
                RestClient client = new RestClient(ConfigurationManager.AppSettings["fsaleApiUrl"].ToString());
                var request = new RestRequest("api/employees/login", Method.POST);
                request.AddJsonBody(loginModel);
                request.AddHeader("Content-Type", "application/json");
                IRestResponse response = client.Execute(request);
                var content = response.Content; // raw content as string
                JObject json = JObject.Parse(content);

                try
                {
                    Session["UserId"] = json["data"]["UserId"].ToString();
                    Session["EmployeeId"] = json["data"]["EmployeeId"].ToString();
                    Session["EmployeeName"] = json["data"]["EmployeeName"].ToString();
                    Session["ShopId"] = json["data"]["ShopId"].ToString();
                    Session["ShopName"] = json["data"]["ShopName"].ToString();
                    Session["BranchId"] = json["data"]["BranchId"].ToString();
                    Session["Group"] = json["data"]["Group"].ToString();
                    Session["FacebookUserId"] = json["data"]["FacebookUserId"].ToString();
                    Session["IsTokenValid"] = false;
                    Session["UserFacebookToken"] = null;
                    Session["access_token"] = null;
                    client = new RestClient(ConfigurationManager.AppSettings["fsaleApiUrl"].ToString());
                    request = new RestRequest("api/security/token", Method.POST);
                    request.AddParameter("grant_type", "password"); // adds to POST or URL querystring based on Method  
                    request.AddParameter("userName", loginModel.email);
                    request.AddParameter("password", loginModel.password);
                    request.AddHeader("Content-Type", "application/x-www-form-urlencoded");
                    response = client.Execute(request);
                    content = response.Content; // raw content as string

                    TokenResponse tokenResponse = JsonConvert.DeserializeObject<TokenResponse>(content);
                    if (tokenResponse != null)
                        if (tokenResponse.access_token != null)
                        {
                            Session["access_token"] = tokenResponse.access_token;
                            Session["temp_Email"] = loginModel.email;
                            Session["temp_Password"] = loginModel.password;
                        }
                }
                catch (Exception ex)
                { }

                if (Int32.Parse(json["meta"]["error_code"].ToString()) == 200) {
                    return Redirect("/index.html");
                }
            }

            return View();
        }

        public ActionResult Logout()
        {
            Session["EmployeeId"] = null;
            Session["UserId"] = null;
            Session["UserFacebookToken"] = null;
            Session["access_token"] = null;
            Session["temp_Email"] = null;
            Session["temp_Password"] = null;
            Session["IsTokenValid"] = null;
            Session["isNewUser"] = null;
            Session["FacebookUserId"] = null;
            Session["EmployeeName"] = null;
            Session["ShopId"] = null;
            Session["ShopName"] = null;
            Session["BranchId"] = null;
            Session["Group"] = null;
            return Redirect("/login.html");
        }
    }
}
