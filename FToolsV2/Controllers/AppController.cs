using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using RestSharp;
using System.Configuration;
using FToolsV2.Models;
using Newtonsoft;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Web.SessionState;
using log4net;
using System.Threading.Tasks;
using FToolsV2;
using System.Net.Http.Headers;
using System.Text;

namespace FToolsV2.Controllers
{
    [RoutePrefix("api/app")]
    public class AppController : ApiController, IRequiresSessionState
    {
        private static readonly ILog log = LogMaster.GetLogger("fbsale", "fbsale");
        private static readonly bool isLocalDebug = Boolean.Parse(ConfigurationManager.AppSettings["IsDebug"].ToString());

        #region home
        [HttpPost]
        [Route("login")]
        [ActionName("login")]
        public IHttpActionResult login(LoginModel loginModel)
        {
            RestClient client = new RestClient(ConfigurationManager.AppSettings["fsaleApiUrl"].ToString());
            var request = new RestRequest("api/employees/login", Method.POST);
            request.AddJsonBody(loginModel);
            request.AddHeader("Content-Type", "application/json");
            IRestResponse response = client.Execute(request);
            var content = response.Content; // raw content as string
            JObject json = JObject.Parse(content);
            UserData userData = new UserData();
            try
            {
                HttpContext.Current.Session["UserId"] = json["data"]["UserId"].ToString();
                HttpContext.Current.Session["EmployeeId"] = json["data"]["EmployeeId"].ToString();
                userData.EmployeeId = Int32.Parse(json["data"]["EmployeeId"].ToString());
                HttpContext.Current.Session["EmployeeName"] = json["data"]["EmployeeName"].ToString();
                HttpContext.Current.Session["ShopId"] = json["data"]["ShopId"].ToString();
                userData.ShopId = Int32.Parse(json["data"]["ShopId"].ToString());
                HttpContext.Current.Session["ShopName"] = json["data"]["ShopName"].ToString();
                HttpContext.Current.Session["BranchId"] = json["data"]["BranchId"].ToString();
                HttpContext.Current.Session["Group"] = json["data"]["Group"].ToString();
                HttpContext.Current.Session["FacebookUserId"] = json["data"]["FacebookUserId"].ToString();
                HttpContext.Current.Session["IsTokenValid"] = false;
                HttpContext.Current.Session["UserFacebookToken"] = null;
                HttpContext.Current.Session["access_token"] = null;
                userData.meta = new Meta(Int32.Parse(json["meta"]["error_code"].ToString()), json["meta"]["error_message"].ToString());
                client = new RestClient(ConfigurationManager.AppSettings["fsaleApiUrl"].ToString());
                request = new RestRequest("api/security/token", Method.POST);
                request.AddParameter("grant_type", "password"); // adds to POST or URL querystring based on Method  
                request.AddParameter("userName", loginModel.email);
                request.AddParameter("password", loginModel.password);
                request.AddParameter("client_type", "cms");
                request.AddHeader("Content-Type", "application/x-www-form-urlencoded");
                response = client.Execute(request);
                content = response.Content; // raw content as string

                TokenResponse tokenResponse = JsonConvert.DeserializeObject<TokenResponse>(content);
                if (tokenResponse != null)
                    if (tokenResponse.access_token != null)
                    {
                        HttpContext.Current.Session["access_token"] = tokenResponse.access_token;
                        userData.access_token = tokenResponse.access_token;
                        HttpContext.Current.Session["temp_Email"] = loginModel.email;
                        HttpContext.Current.Session["temp_Password"] = loginModel.password;
                    }
            }
            catch (Exception ex)
            { }
            return Ok(userData);
        }

        [HttpPost]
        [Route("loginfacebook")]
        [ActionName("loginfacebook")]
        public IHttpActionResult loginfacebook(LoginFacebookModel loginModel)
        {
            RestClient client = new RestClient(ConfigurationManager.AppSettings["fsaleApiUrl"].ToString());
            var request = new RestRequest("api/employees/loginfacebook", Method.POST);
            request.AddJsonBody(loginModel);
            request.AddHeader("Content-Type", "application/json");
            IRestResponse response = client.Execute(request);
            var content = response.Content;
            log.Info(content);
            JObject json = JObject.Parse(content);
            UserData userData = new UserData();
            try
            {
                userData.meta = new Meta(Int32.Parse(json["meta"]["error_code"].ToString()), json["meta"]["error_message"].ToString());
                HttpContext.Current.Session["UserId"] = json["data"]["UserId"].ToString();
                HttpContext.Current.Session["EmployeeId"] = json["data"]["EmployeeId"].ToString();
                userData.EmployeeId = Int32.Parse(json["data"]["EmployeeId"].ToString());
                HttpContext.Current.Session["EmployeeName"] = json["data"]["EmployeeName"].ToString();
                userData.FullName = json["data"]["EmployeeName"].ToString();
                userData.Phone = json["data"]["Phone"].ToString();
                HttpContext.Current.Session["ShopId"] = json["data"]["ShopId"].ToString();
                userData.ShopId = Int32.Parse(json["data"]["ShopId"].ToString());
                HttpContext.Current.Session["ShopName"] = json["data"]["ShopName"].ToString();
                userData.ShopName = json["data"]["ShopName"].ToString();
                HttpContext.Current.Session["BranchId"] = json["data"]["BranchId"].ToString();
                HttpContext.Current.Session["Group"] = json["data"]["Group"].ToString();
                HttpContext.Current.Session["UserFacebookToken"] = loginModel.token;
                HttpContext.Current.Session["FacebookUserId"] = json["data"]["FacebookUserId"].ToString();
                string fbid = json["data"]["FacebookUserId"].ToString();
                string email = json["data"]["Email"].ToString();
                if (!email.Contains(fbid))
                {
                    userData.RegEmail = email;
                }

                //token date              
                DateTime tokenSince = DateTime.Parse(json["data"]["TokenSince"].ToString());
                //refresh token if date later then 7 days              
                client = new RestClient(ConfigurationManager.AppSettings["fsaleApiUrl"].ToString());
                request = new RestRequest("api/security/token", Method.POST);
                request.AddParameter("grant_type", "password"); // adds to POST or URL querystring based on Method  
                request.AddParameter("userName", json["data"]["Email"]);
                request.AddParameter("password", json["data"]["Password"]);
                request.AddHeader("Content-Type", "application/x-www-form-urlencoded");
                response = client.Execute(request);
                content = response.Content; // raw content as string
                TokenResponse tokenResponse = JsonConvert.DeserializeObject<TokenResponse>(content);
                if (tokenResponse != null)
                    if (tokenResponse.access_token != null)
                    {
                        HttpContext.Current.Session["access_token"] = tokenResponse.access_token;
                        userData.access_token = tokenResponse.access_token;
                        HttpContext.Current.Session["UserFacebookToken"] = loginModel.token;
                        HttpContext.Current.Session["temp_Email"] = json["data"]["Email"];
                        HttpContext.Current.Session["temp_Password"] = json["data"]["Password"];
                        //update page token       
                        //check if need refresh token
                        bool isNeedTokenRefresh = false;
                        //check if token invalid
                        //client = new RestClient(ConfigurationManager.AppSettings["https://graph.facebook.com/"].ToString());
                        //request = new RestRequest("me?access_token=", Method.GET);
                        //request.AddJsonBody(loginModel);
                        //request.AddHeader("Content-Type", "application/json");
                        //response = client.Execute(request);
                        //content = response.Content;
                        //FBMeResponse me = JsonConvert.DeserializeObject<FBMeResponse>(content);
                        //if (me == null || me.id == null)
                        //{
                        //    //token invalid ??
                        //    isNeedTokenRefresh = true;
                        //}
                        if (loginModel.token != null && loginModel.token != "")
                        {
                            HttpContext.Current.Session["IsTokenValid"] = true;
                            if (DateTime.Now > tokenSince.AddDays(7) || isNeedTokenRefresh)
                            {
                                //local
                                string urlLongLiveToken;
                                if (isLocalDebug)
                                    urlLongLiveToken = "/oauth/access_token?grant_type=fb_exchange_token&client_id=390808924586266&client_secret=ee73cef9a3c1b75027b0c93f0e9b994f&fb_exchange_token=" + HttpContext.Current.Session["UserFacebookToken"].ToString();
                                else
                                    urlLongLiveToken = "/oauth/access_token?grant_type=fb_exchange_token&client_id=313601012371988&client_secret=a993e6c800e78daf7f299f15e933b588&fb_exchange_token=" + HttpContext.Current.Session["UserFacebookToken"].ToString();
                                client = new RestClient("https://graph.facebook.com");
                                request = new RestRequest(urlLongLiveToken, Method.GET);
                                response = client.Execute(request);
                                content = response.Content; // raw content as string
                                //log.Info("login - long term user token :" + content);
                                string longLiveToken = "";
                                if (content != null && content.Length > 0)
                                {
                                    LongTermToken token = JsonConvert.DeserializeObject<LongTermToken>(content);
                                    longLiveToken = token.access_token;
                                }
                                //generate long live access token
                                client = new RestClient("https://graph.facebook.com");
                                request = new RestRequest("me/accounts/?access_token=" + longLiveToken, Method.GET);
                                response = client.Execute(request);
                                content = response.Content; // raw content as string
                                //log.Info("login - long term page token :" + content);
                                FBAccountResp resp = JsonConvert.DeserializeObject<FBAccountResp>(content);
                                if (resp != null)
                                {
                                    List<String> ids = new List<string>();
                                    List<String> tokens = new List<string>();
                                    if (resp.data != null && resp.data.Count > 0)
                                    {
                                        foreach (FBPage page in resp.data)
                                        {
                                            ids.Add(page.id);
                                            tokens.Add(page.access_token);
                                        }
                                    }
                                    UpdatePageTokenReq updatePage = new UpdatePageTokenReq();
                                    updatePage.ids = ids;
                                    updatePage.tokens = tokens;
                                    //update
                                    client = new RestClient(ConfigurationManager.AppSettings["fsaleApiUrl"].ToString());
                                    request = new RestRequest("api/pages/UpdatePageToken", Method.POST);
                                    request.AddHeader("Content-Type", "application/json");
                                    string author = "bearer ";
                                    author += HttpContext.Current.Session["access_token"] != null ? HttpContext.Current.Session["access_token"].ToString() : "";
                                    request.AddHeader("Authorization", author);
                                    request.AddJsonBody(updatePage);
                                    response = client.Execute(request);
                                    content = response.Content;
                                    log.Info("login - long term page token update result:" + content);
                                }
                            }
                        }
                        else
                        {
                            HttpContext.Current.Session["IsTokenValid"] = false;
                        }
                    }
            }
            catch (Exception ex)
            {
                log.Info(ex.Message + "\n" + ex.StackTrace);
            }
            return Ok(userData);
        }


        [HttpPost]
        [Route("loginfacebookOld")]
        [ActionName("loginfacebookOld")]
        public IHttpActionResult loginfacebookOld(LoginFacebookModel loginModel)
        {           
            RestClient client = new RestClient(ConfigurationManager.AppSettings["baseApiUrl"].ToString());
            loginModel.email = loginModel.id + "@facebook.com";
            var request = new RestRequest("api/users/login", Method.POST);
            request.AddJsonBody(loginModel);
            request.AddHeader("Content-Type", "application/json");
            IRestResponse response = client.Execute(request);
            var content = response.Content;
            log.Info(content);
            JObject json = JObject.Parse(content);
            UserData userData = new UserData();
            try
            {
                HttpContext.Current.Session["UserId"] = json["data"]["user_id"].ToString();
                userData.user_id = Int32.Parse(json["data"]["user_id"].ToString());
                userData.user_facebook_id = json["data"]["user_facebook_id"].ToString();
                HttpContext.Current.Session["UserFacebookToken"] = loginModel.token;
                HttpContext.Current.Session["UserName"] = loginModel.name;
                HttpContext.Current.Session["FacebookUserId"] = json["data"]["user_facebook_id"].ToString();
                //userData.meta = new Meta(Int32.Parse(json["meta"]["error_code"].ToString()), json["meta"]["error_message"].ToString());

                //token date              
                DateTime tokenSince = DateTime.Parse(json["data"]["created_at"].ToString());
                //refresh token if date later then 7 days              
                //client = new RestClient(ConfigurationManager.AppSettings["baseApiUrl"].ToString());
                //request = new RestRequest("api/security/token", Method.POST);
                //request.AddParameter("grant_type", "password"); // adds to POST or URL querystring based on Method  
                //request.AddParameter("userName", json["data"]["Email"]);
                //request.AddParameter("password", json["data"]["Password"]);
                //request.AddHeader("Content-Type", "application/x-www-form-urlencoded");
                //response = client.Execute(request);
                //content = response.Content; // raw content as string
                //TokenResponse tokenResponse = JsonConvert.DeserializeObject<TokenResponse>(content);
                //if (tokenResponse != null)
                    //if (tokenResponse. != null)
                    //{
                //HttpContext.Current.Session["access_token"] = loginModel.token;
                userData.access_token = loginModel.token;
                //HttpContext.Current.Session["UserFacebookToken"] = loginModel.token;
                //HttpContext.Current.Session["temp_Email"] = json["data"]["Email"];
                //HttpContext.Current.Session["temp_Password"] = json["data"]["Password"];
                //update page token       
                //check if need refresh token
                if (loginModel.token != null && loginModel.token != "")
                {
                    HttpContext.Current.Session["IsTokenValid"] = true;
                    if (DateTime.Now > tokenSince.AddDays(7))
                    {
                        //local
                        string urlLongLiveToken;
                        if (isLocalDebug)
                            urlLongLiveToken = "/oauth/access_token?grant_type=fb_exchange_token&client_id=390808924586266&client_secret=ee73cef9a3c1b75027b0c93f0e9b994f&fb_exchange_token=" + HttpContext.Current.Session["UserFacebookToken"].ToString();
                        else
                            urlLongLiveToken = "/oauth/access_token?grant_type=fb_exchange_token&client_id=313601012371988&client_secret=a993e6c800e78daf7f299f15e933b588&fb_exchange_token=" + HttpContext.Current.Session["UserFacebookToken"].ToString();
                        client = new RestClient("https://graph.facebook.com");
                        request = new RestRequest(urlLongLiveToken, Method.GET);
                        response = client.Execute(request);
                        content = response.Content; // raw content as string
                                                    //log.Info("login - long term user token :" + content);
                        string longLiveToken = "";
                        if (content != null && content.Length > 0)
                        {
                            LongTermToken token = JsonConvert.DeserializeObject<LongTermToken>(content);
                            longLiveToken = token.access_token;
                        }
                        //generate long live access token
                        client = new RestClient("https://graph.facebook.com");
                        request = new RestRequest("me/accounts/?access_token=" + longLiveToken, Method.GET);
                        response = client.Execute(request);
                        content = response.Content; // raw content as string
                                                    //log.Info("login - long term page token :" + content);
                        FBAccountResp resp = JsonConvert.DeserializeObject<FBAccountResp>(content);
                        if (resp != null)
                        {
                            List<String> ids = new List<string>();
                            List<String> tokens = new List<string>();
                            if (resp.data != null && resp.data.Count > 0)
                            {
                                foreach (FBPage page in resp.data)
                                {
                                    ids.Add(page.id);
                                    tokens.Add(page.access_token);
                                }
                            }
                            //UpdatePageTokenReq updatePage = new UpdatePageTokenReq();
                            //updatePage.ids = ids;
                            //updatePage.tokens = tokens;
                            ////update
                            //client = new RestClient(ConfigurationManager.AppSettings["baseApiUrl"].ToString());
                            //request = new RestRequest("api/pages/UpdatePageToken", Method.POST);
                            //request.AddHeader("Content-Type", "application/json");
                            //string author = "bearer ";
                            //author += HttpContext.Current.Session["access_token"] != null ? HttpContext.Current.Session["access_token"].ToString() : "";
                            //request.AddHeader("Authorization", author);
                            //request.AddJsonBody(updatePage);
                            //response = client.Execute(request);
                            //content = response.Content;
                            //log.Info("login - long term page token update result:" + content);
                        }
                    }
                }
                else
                {
                    HttpContext.Current.Session["IsTokenValid"] = false;
                }
                //}
            }
            catch (Exception ex)
            {
                log.Info(ex.Message + "\n" + ex.StackTrace);
            }
            return Ok(userData);
        }

        [HttpPost]
        [Route("loginfacebookFSale")]
        [ActionName("loginfacebookFSale")]
        public IHttpActionResult loginfacebookFSale(LoginFacebookModel loginModel)
        {
            RestClient client = new RestClient(ConfigurationManager.AppSettings["fsaleApiUrl"].ToString());
            var request = new RestRequest("api/employees/loginfacebook", Method.POST);
            request.AddJsonBody(loginModel);
            request.AddHeader("Content-Type", "application/json");
            IRestResponse response = client.Execute(request);
            var content = response.Content;
            log.Info(content);
            JObject json = JObject.Parse(content);
            UserData userData = new UserData();
            try
            {
                userData.meta = new Meta(Int32.Parse(json["meta"]["error_code"].ToString()), json["meta"]["error_message"].ToString());
                HttpContext.Current.Session["UserId"] = json["data"]["UserId"].ToString();
                HttpContext.Current.Session["EmployeeId"] = json["data"]["EmployeeId"].ToString();
                userData.EmployeeId = Int32.Parse(json["data"]["EmployeeId"].ToString());
                HttpContext.Current.Session["EmployeeName"] = json["data"]["EmployeeName"].ToString();
                userData.FullName = json["data"]["EmployeeName"].ToString();
                userData.Phone = json["data"]["Phone"].ToString();
                HttpContext.Current.Session["ShopId"] = json["data"]["ShopId"].ToString();
                userData.ShopId = Int32.Parse(json["data"]["ShopId"].ToString());
                HttpContext.Current.Session["ShopName"] = json["data"]["ShopName"].ToString();
                userData.ShopName = json["data"]["ShopName"].ToString();
                HttpContext.Current.Session["BranchId"] = json["data"]["BranchId"].ToString();
                HttpContext.Current.Session["Group"] = json["data"]["Group"].ToString();
                HttpContext.Current.Session["UserFacebookToken"] = loginModel.token;
                HttpContext.Current.Session["FacebookUserId"] = json["data"]["FacebookUserId"].ToString();
                string fbid = json["data"]["FacebookUserId"].ToString();
                string email = json["data"]["Email"].ToString();
                if (!email.Contains(fbid))
                {
                    userData.RegEmail = email;
                }

                //token date              
                DateTime tokenSince = DateTime.Parse(json["data"]["TokenSince"].ToString());
                //refresh token if date later then 7 days              
                client = new RestClient(ConfigurationManager.AppSettings["fsaleApiUrl"].ToString());
                request = new RestRequest("api/security/token", Method.POST);
                request.AddParameter("grant_type", "password"); // adds to POST or URL querystring based on Method  
                request.AddParameter("userName", json["data"]["Email"]);
                request.AddParameter("password", json["data"]["Password"]);
                request.AddHeader("Content-Type", "application/x-www-form-urlencoded");
                response = client.Execute(request);
                content = response.Content; // raw content as string
                TokenResponse tokenResponse = JsonConvert.DeserializeObject<TokenResponse>(content);
                if (tokenResponse != null)
                    if (tokenResponse.access_token != null)
                    {
                        HttpContext.Current.Session["access_token"] = tokenResponse.access_token;
                        userData.access_token = tokenResponse.access_token;
                        HttpContext.Current.Session["UserFacebookToken"] = loginModel.token;
                        HttpContext.Current.Session["temp_Email"] = json["data"]["Email"];
                        HttpContext.Current.Session["temp_Password"] = json["data"]["Password"];
                        //update page token       
                        //check if need refresh token
                        bool isNeedTokenRefresh = false;
                        //check if token invalid
                        //client = new RestClient(ConfigurationManager.AppSettings["https://graph.facebook.com/"].ToString());
                        //request = new RestRequest("me?access_token=", Method.GET);
                        //request.AddJsonBody(loginModel);
                        //request.AddHeader("Content-Type", "application/json");
                        //response = client.Execute(request);
                        //content = response.Content;
                        //FBMeResponse me = JsonConvert.DeserializeObject<FBMeResponse>(content);
                        //if (me == null || me.id == null)
                        //{
                        //    //token invalid ??
                        //    isNeedTokenRefresh = true;
                        //}
                        if (loginModel.token != null && loginModel.token != "")
                        {
                            HttpContext.Current.Session["IsTokenValid"] = true;
                            if (DateTime.Now > tokenSince.AddDays(7) || isNeedTokenRefresh)
                            {
                                //local
                                string urlLongLiveToken;
                                if (isLocalDebug)
                                    urlLongLiveToken = "/oauth/access_token?grant_type=fb_exchange_token&client_id=390808924586266&client_secret=ee73cef9a3c1b75027b0c93f0e9b994f&fb_exchange_token=" + HttpContext.Current.Session["UserFacebookToken"].ToString();
                                else
                                    urlLongLiveToken = "/oauth/access_token?grant_type=fb_exchange_token&client_id=313601012371988&client_secret=a993e6c800e78daf7f299f15e933b588&fb_exchange_token=" + HttpContext.Current.Session["UserFacebookToken"].ToString();
                                client = new RestClient("https://graph.facebook.com");
                                request = new RestRequest(urlLongLiveToken, Method.GET);
                                response = client.Execute(request);
                                content = response.Content; // raw content as string
                                //log.Info("login - long term user token :" + content);
                                string longLiveToken = "";
                                if (content != null && content.Length > 0)
                                {
                                    LongTermToken token = JsonConvert.DeserializeObject<LongTermToken>(content);
                                    longLiveToken = token.access_token;
                                }
                                //generate long live access token
                                client = new RestClient("https://graph.facebook.com");
                                request = new RestRequest("me/accounts/?access_token=" + longLiveToken, Method.GET);
                                response = client.Execute(request);
                                content = response.Content; // raw content as string
                                //log.Info("login - long term page token :" + content);
                                FBAccountResp resp = JsonConvert.DeserializeObject<FBAccountResp>(content);
                                if (resp != null)
                                {
                                    List<String> ids = new List<string>();
                                    List<String> tokens = new List<string>();
                                    if (resp.data != null && resp.data.Count > 0)
                                    {
                                        foreach (FBPage page in resp.data)
                                        {
                                            ids.Add(page.id);
                                            tokens.Add(page.access_token);
                                        }
                                    }
                                    UpdatePageTokenReq updatePage = new UpdatePageTokenReq();
                                    updatePage.ids = ids;
                                    updatePage.tokens = tokens;
                                    //update
                                    client = new RestClient(ConfigurationManager.AppSettings["baseApiUrl"].ToString());
                                    request = new RestRequest("api/pages/UpdatePageToken", Method.POST);
                                    request.AddHeader("Content-Type", "application/json");
                                    string author = "bearer ";
                                    author += HttpContext.Current.Session["access_token"] != null ? HttpContext.Current.Session["access_token"].ToString() : "";
                                    request.AddHeader("Authorization", author);
                                    request.AddJsonBody(updatePage);
                                    response = client.Execute(request);
                                    content = response.Content;
                                    log.Info("login - long term page token update result:" + content);
                                }
                            }
                        }
                        else
                        {
                            HttpContext.Current.Session["IsTokenValid"] = false;
                        }
                    }
            }
            catch (Exception ex)
            {
                log.Info(ex.Message + "\n" + ex.StackTrace);
            }
            return Ok(userData);
        }

        [HttpGet]
        [Route("getTopPage")]
        [ActionName("getTopPage")]
        public IHttpActionResult getTopPage([FromUri] string query)
        {
            RestClient client = new RestClient(ConfigurationManager.AppSettings["baseApiUrl"].ToString());
            var request = new RestRequest("api/pages?query="+ query +"&page=1&page_size=10&order_by=fan_count+desc", Method.GET);
            IRestResponse response = client.Execute(request);
            var content = response.Content;
            JObject json = JObject.Parse(content);
            return Ok(json);
        }

        [HttpGet]
        [Route("getTopPageFan")]
        [ActionName("getTopPageFan")]
        public IHttpActionResult getTopPageFan([FromUri] string date, [FromUri] string country_code)
        {
            RestClient client = new RestClient(ConfigurationManager.AppSettings["baseApiUrl"].ToString());
            var request = new RestRequest("/api/pages/top_growth?page=1&page_size=10&date=" + date + "&country_code=" + country_code, Method.GET);
            IRestResponse response = client.Execute(request);
            var content = response.Content;
            JObject json = JObject.Parse(content);
            return Ok(json);
        }

        [HttpGet]
        [Route("getTopGroup")]
        [ActionName("getTopGroup")]
        public IHttpActionResult getTopGroup()
        {
            RestClient client = new RestClient(ConfigurationManager.AppSettings["baseApiUrl"].ToString());
            var request = new RestRequest("api/groups?query=1=1&page=1&page_size=10&order_by=members_count+desc", Method.GET);
            IRestResponse response = client.Execute(request);
            var content = response.Content;
            JObject json = JObject.Parse(content);
            return Ok(json);
        }
        

        #endregion   
 
        #region dashboard
        [HttpGet]
        [Route("findPageAndGroup")]
        [ActionName("findPageAndGroup")]
        public IHttpActionResult findPageAndGroup([FromUri] int type, [FromUri] string query)
        {
            RestClient client = new RestClient(ConfigurationManager.AppSettings["baseApiUrl"].ToString());
            var request = new RestRequest("api/tasks/find?query=" + query + "&type=" + type, Method.GET);
            IRestResponse response = client.Execute(request);
            var content = response.Content;
            JObject json = JObject.Parse(content);
            return Ok(json);
        }

        [HttpGet]
        [Route("fetchInfo")]
        [ActionName("fetchInfo")]
        public IHttpActionResult fetchInfo([FromUri] string id, [FromUri] string type)
        {
            RestClient client = new RestClient(ConfigurationManager.AppSettings["baseApiUrl"].ToString());
            var request = new RestRequest("api/tasks/fetchInfo?id=" + id + "&type=" + type, Method.GET);
            IRestResponse response = client.Execute(request);
            var content = response.Content;
            JObject json = JObject.Parse(content);
            return Ok(json);
        }

        [HttpGet]
        [Route("findPage")]
        [ActionName("findPage")]
        public IHttpActionResult findPage([FromUri] string id)
        {
            RestClient client = new RestClient(ConfigurationManager.AppSettings["baseApiUrl"].ToString());
            var request = new RestRequest("api/pages/find/" + id, Method.GET);
            IRestResponse response = client.Execute(request);
            var content = response.Content;
            JObject json = JObject.Parse(content);
            return Ok(json);
        }

        [HttpGet]
        [Route("findGroup")]
        [ActionName("findGroup")]
        public IHttpActionResult findGroup([FromUri] string id)
        {
            RestClient client = new RestClient(ConfigurationManager.AppSettings["baseApiUrl"].ToString());
            var request = new RestRequest("api/groups/find/" + id, Method.GET);
            IRestResponse response = client.Execute(request);
            var content = response.Content;
            JObject json = JObject.Parse(content);
            return Ok(json);
        }

        [HttpGet]
        [Route("fetchPagePost")]
        [ActionName("fetchPagePost")]
        public IHttpActionResult fetchPagePost([FromUri] string id, [FromUri] string startDate, [FromUri] string endDate)
        {
            RestClient client = new RestClient(ConfigurationManager.AppSettings["baseApiUrl"].ToString());
            DateTime date = DateTime.Now;
            var request = new RestRequest("api/tasks/fetchPagePost?id=" + id + "&startDate=" + startDate + "&endDate=" + endDate, Method.GET);
            IRestResponse response = client.Execute(request);
            var content = response.Content;
            JObject json = JObject.Parse(content);
            return Ok(json);
        }

        [HttpGet]
        [Route("fetchGroupPost")]
        [ActionName("fetchGroupPost")]
        public IHttpActionResult fetchGroupPost([FromUri] string id, [FromUri] string startDate, [FromUri] string endDate, [FromUri] string token)
        {
            RestClient client = new RestClient(ConfigurationManager.AppSettings["baseApiUrl"].ToString());
            var request = new RestRequest("api/tasks/fetchGroupPost?id=" + id + "&startDate=" + startDate + "&endDate=" + endDate + "&access_token=" + token, Method.GET);
            IRestResponse response = client.Execute(request);
            var content = response.Content;
            JObject json = JObject.Parse(content);
            return Ok(json);
        }

        [HttpGet]
        [Route("fetchSecretGroup")]
        [ActionName("fetchSecretGroup")]
        public IHttpActionResult fetchSecretGroup([FromUri] string id, [FromUri] string token)
        {
            RestClient client = new RestClient(ConfigurationManager.AppSettings["baseApiUrl"].ToString());
            var request = new RestRequest("api/tasks/fetchSecretGroup?id=" + id + "&access_token=" + token, Method.GET);
            IRestResponse response = client.Execute(request);
            var content = response.Content;
            JObject json = JObject.Parse(content);
            return Ok(json);
        }

        [HttpPost]
        [Route("createDashboard")]
        [ActionName("createDashboard")]
        public IHttpActionResult createDashboard(Dashboard dashboard)
        {
            RestClient client = new RestClient(ConfigurationManager.AppSettings["baseApiUrl"].ToString());
            int userId = dashboard.dashboard_id;//HttpContext.Current.Session["UserId"].ToString();
            var request = new RestRequest("api/dashboards/" + userId + "/details", Method.POST);
            request.AddJsonBody(dashboard);
            IRestResponse response = client.Execute(request);
            var content = response.Content; // raw content as string
            JObject json = JObject.Parse(content);
            return Ok(json);
        }

        [HttpPost]
        [Route("deleteDashBoard")]
        [ActionName("deleteDashBoard")]
        public IHttpActionResult deleteDashBoard([FromUri] int id, [FromUri] int did)
        {
            RestClient client = new RestClient(ConfigurationManager.AppSettings["baseApiUrl"].ToString());
            var request = new RestRequest("api/dashboards/" + id + "/details/" + did, Method.DELETE);
            IRestResponse response = client.Execute(request);
            var content = response.Content;
            JObject json = JObject.Parse(content);
            return Ok(json);
        }

        [HttpGet]
        [Route("getDashBoard")]
        [ActionName("getDashBoard")]
        public IHttpActionResult getDashBoard([FromUri] int id)
        {
            RestClient client = new RestClient(ConfigurationManager.AppSettings["baseApiUrl"].ToString());
            var request = new RestRequest("api/dashboards/" + id + "/details");
            IRestResponse response = client.Execute(request);
            var content = response.Content;
            JObject json = JObject.Parse(content);
            return Ok(json);
        }
        #endregion

        #region detail post
        [HttpGet]
        [Route("getPost")]
        [ActionName("getPost")]
        public IHttpActionResult getPost([FromUri] int id, [FromUri] int page, [FromUri] int page_size, [FromUri] string query, [FromUri] string order_by)
        {
            RestClient client = new RestClient(ConfigurationManager.AppSettings["baseApiUrl"].ToString());
            string url = "";
            if (order_by != null && order_by.Trim() != "")
                url = "api/pages/" + id + "/posts?query=" + query + "&page=" + page + "&page_size=" + page_size + "&order_by=" + order_by;
            else
                url = "api/pages/" + id + "/posts?query=" + query + "&page=" + page + "&page_size=" + page_size;
            var request = new RestRequest(url, Method.GET);
            IRestResponse response = client.Execute(request);
            var content = response.Content; 
            JObject json = JObject.Parse(content);
            return Ok(json);
        }
        #endregion

        #region Words
        [HttpGet]
        [Route("getWord")]
        [ActionName("getWord")]
        public IHttpActionResult getWord([FromUri] int id)
        {
            RestClient client = new RestClient(ConfigurationManager.AppSettings["baseApiUrl"].ToString());
            var request = new RestRequest("api/pages/" + id + "/words?query=1=1&page=1&page_size=20&order_by=", Method.GET);
            IRestResponse response = client.Execute(request);
            var content = response.Content;
            JObject json = JObject.Parse(content);
            return Ok(json);
        }
        #endregion

        #region HashTag
        [HttpGet]
        [Route("getHashTag")]
        [ActionName("getHashTag")]
        public IHttpActionResult getHashTag([FromUri] int id)
        {
            RestClient client = new RestClient(ConfigurationManager.AppSettings["baseApiUrl"].ToString());
            var request = new RestRequest("api/pages/" + id + "/hashtags?query=1=1&page=1&page_size=10&order_by=", Method.GET);
            IRestResponse response = client.Execute(request);
            var content = response.Content;
            JObject json = JObject.Parse(content);
            return Ok(json);
        }
        #endregion

        #region Get Detail Page
        [HttpGet]
        [Route("getDetailPage")]
        [ActionName("getDetailPage")]
        public IHttpActionResult getDetailPage([FromUri] int id)
        {
            RestClient client = new RestClient(ConfigurationManager.AppSettings["baseApiUrl"].ToString());
            var request = new RestRequest("api/pages/" + id, Method.GET);
            IRestResponse response = client.Execute(request);
            var content = response.Content;
            JObject json = JObject.Parse(content);
            return Ok(json);
        }
        #endregion

        #region Get Fan By Countries
        [HttpGet]
        [Route("getFanByCountries")]
        [ActionName("getFanByCountries")]
        public IHttpActionResult getFanByCountries([FromUri] int id)
        {
            RestClient client = new RestClient(ConfigurationManager.AppSettings["baseApiUrl"].ToString());
            var request = new RestRequest("api/pages/" + id + "/fan_by_countries", Method.GET);
            IRestResponse response = client.Execute(request);
            var content = response.Content;
            JObject json = JObject.Parse(content);
            return Ok(json);
        }
        #endregion

        #region Detail Group
        [HttpGet]
        [Route("getDetailGroup")]
        [ActionName("getDetailGroup")]
        public IHttpActionResult getDetailGroup([FromUri] int id)
        {
            RestClient client = new RestClient(ConfigurationManager.AppSettings["baseApiUrl"].ToString());
            var request = new RestRequest("api/groups/" + id, Method.GET);
            IRestResponse response = client.Execute(request);
            var content = response.Content;
            JObject json = JObject.Parse(content);
            return Ok(json);
        }

        [HttpGet]
        [Route("getPostGroup")]
        [ActionName("getPostGroup")]
        public IHttpActionResult getPostGroup([FromUri] int id, [FromUri] int page, [FromUri] int page_size, [FromUri] string query, [FromUri] string order_by)
        {
            RestClient client = new RestClient(ConfigurationManager.AppSettings["baseApiUrl"].ToString());
            string url = "";
            if (order_by != null && order_by.Trim() != "")
                url = "api/groups/" + id + "/posts?query=" + query + "&page=" + page + "&page_size=" + page_size + "&order_by=" + order_by;
            else
                url = "api/groups/" + id + "/posts?query=" + query + "&page=" + page + "&page_size=" + page_size;
            var request = new RestRequest(url, Method.GET);
            IRestResponse response = client.Execute(request);
            var content = response.Content;
            JObject json = JObject.Parse(content);
            return Ok(json);
        }

        [HttpGet]
        [Route("getWordGroup")]
        [ActionName("getWordGroup")]
        public IHttpActionResult getWordGroup([FromUri] int id)
        {
            RestClient client = new RestClient(ConfigurationManager.AppSettings["baseApiUrl"].ToString());
            var request = new RestRequest("api/groups/" + id + "/words?query=1=1&page=1&page_size=20&order_by=", Method.GET);
            IRestResponse response = client.Execute(request);
            var content = response.Content;
            JObject json = JObject.Parse(content);
            return Ok(json);
        }

        #endregion

        #region Get All Page
        [HttpGet]
        [Route("getAllPage")]
        [ActionName("getAllPage")]
        public IHttpActionResult getAllPage([FromUri] int page, [FromUri] int page_size, [FromUri] string query, [FromUri] string order_by)
        {
            RestClient client = new RestClient(ConfigurationManager.AppSettings["baseApiUrl"].ToString());
            string url = "";
            if (order_by != null && order_by.Trim() != "")
                url = "api/pages?query=" + query + "&page=" + page + "&page_size=" + page_size + "&order_by=" + order_by;
            else
                url = "api/pages?query=" + query + "&page=" + page + "&page_size=" + page_size;
            var request = new RestRequest(url, Method.GET);
            IRestResponse response = client.Execute(request);
            var content = response.Content;
            JObject json = JObject.Parse(content);
            return Ok(json);
        }
        #endregion

        #region Get All Group
        [HttpGet]
        [Route("getAllGroup")]
        [ActionName("getAllGroup")]
        public IHttpActionResult getAllGroup([FromUri] int page, [FromUri] int page_size, [FromUri] string query, [FromUri] string order_by)
        {
            RestClient client = new RestClient(ConfigurationManager.AppSettings["baseApiUrl"].ToString());
            string url = "";
            if (order_by != null && order_by.Trim() != "")
                url = "api/groups?query=" + query + "&page=" + page + "&page_size=" + page_size + "&order_by=" + order_by;
            else
                url = "api/groups?query=" + query + "&page=" + page + "&page_size=" + page_size;
            var request = new RestRequest(url, Method.GET);
            IRestResponse response = client.Execute(request);
            var content = response.Content;
            JObject json = JObject.Parse(content);
            return Ok(json);
        }
        #endregion

        #region Get Related Page
        [HttpGet]
        [Route("getRelatedPage")]
        [ActionName("getRelatedPage")]
        public IHttpActionResult getAllGroup([FromUri] int id)
        {
            RestClient client = new RestClient(ConfigurationManager.AppSettings["baseApiUrl"].ToString());
            var request = new RestRequest("api/pages/" + id + "/related?page=1&page_size=10", Method.GET);
            IRestResponse response = client.Execute(request);
            var content = response.Content;
            JObject json = JObject.Parse(content);
            return Ok(json);
        }
        #endregion

        #region Lấy thông tin page theo ngày
        [HttpGet]
        [Route("getDetailPageDaily")]
        [ActionName("getDetailPageDaily")]
        public IHttpActionResult getDetailPageDaily([FromUri] int id, [FromUri] string start_date, [FromUri] string end_date)
        {
            RestClient client = new RestClient(ConfigurationManager.AppSettings["baseApiUrl"].ToString());
            var request = new RestRequest("api/pages/" + id + "/daily?start_date=" + start_date + "&end_date=" + end_date, Method.GET);
            IRestResponse response = client.Execute(request);
            var content = response.Content;
            JObject json = JObject.Parse(content);
            return Ok(json);
        }
        #endregion

        #region
        [HttpGet]
        [Route("getPostByTimeFrame")]
        [ActionName("getPostByTimeFrame")]
        public IHttpActionResult getPostByTimeFrame([FromUri] int id, [FromUri] string start_date, [FromUri] string end_date, [FromUri] int step)
        {
            RestClient client = new RestClient(ConfigurationManager.AppSettings["baseApiUrl"].ToString());
            var request = new RestRequest("api/pages/" + id + "/posts_by_timeframe?start_date=" + start_date + "&end_date=" + end_date + "&step=" + step, Method.GET);
            IRestResponse response = client.Execute(request);
            var content = response.Content;
            JObject json = JObject.Parse(content);
            return Ok(json);
        }
        #endregion

        #region Lấy danh sách post của hệ thống
        [HttpGet]
        [Route("getPostOnSystem")]
        [ActionName("getPostOnSystem")]

        public IHttpActionResult getPostOnSystem([FromUri] int page, [FromUri] int page_size, [FromUri] string query, [FromUri] string order_by)
        {
            RestClient client = new RestClient(ConfigurationManager.AppSettings["baseApiUrl"].ToString());
            var request = new RestRequest("api/posts/?page=" + page + "&page_size=" + page_size + "&query=" + query + "&order_by=" + order_by, Method.GET);
            IRestResponse response = client.Execute(request);
            var content = response.Content;
            JObject json = JObject.Parse(content);
            return Ok(json);
        }
        #endregion

        #region Lấy danh sách danh mục
        [HttpGet]
        [Route("getCategory")]
        [ActionName("getCategory")]
        public IHttpActionResult getCategory()
        {
            RestClient client = new RestClient(ConfigurationManager.AppSettings["baseApiUrl"].ToString());
            var request = new RestRequest("api/pages/categories", Method.GET);
            IRestResponse response = client.Execute(request);
            var content = response.Content;
            JObject json = JObject.Parse(content);
            return Ok(json);
        }
        #endregion
    }
}
