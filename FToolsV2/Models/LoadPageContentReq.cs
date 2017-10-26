using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FToolsV2.Models
{
    public class LoadPageContentReq
    {
        public int page_id { get; set; }
        public string since { get; set; }
    }
}