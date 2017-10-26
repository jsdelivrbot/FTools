using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FToolsV2.Models
{
    public class UpdatePageTokenReq
    {
        public List<String> ids { get; set; }
        public List<String> tokens { get; set; }
    }
}