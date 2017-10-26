using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FToolsV2.Models
{
    public class FBAccountResp
    {
        public List<FBPage> data { get; set; }
    }

    public class FBPage
    {
        public string access_token { get; set; }
        public string name { get; set; }
        public string id { get; set; }
    }
}