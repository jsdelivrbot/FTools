using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FToolsV2.Models
{
    public class DefaultResponse
    {
        public Meta meta { get; set; }
        public object data { get; set; }
        public object metadata { get; set; }
        public object metadatainfo { get; set; }
    }
}