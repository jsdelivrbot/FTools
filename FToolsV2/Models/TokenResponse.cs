using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace FToolsV2.Models
{
    public class TokenResponse
    {
        public string access_token { get; set; }
        public string token_type { get; set; }
        public string expires_in { get; set; }
        public string userName { get; set; }
        [JsonProperty(".issued")]
        public DateTime issued {get;set;}
        [JsonProperty(".expires")]
        public DateTime expires { get; set; } 
        
    }
}