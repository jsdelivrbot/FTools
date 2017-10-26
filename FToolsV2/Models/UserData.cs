using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FToolsV2.Models
{
    public class UserData
    {
        public Meta meta { get; set; }
        public int user_id { get; set; }
        public string user_facebook_id { get; set; }
        public string access_token { get; set; }
        public int EmployeeId { get; set; }
        public int ShopId { get; set; }
        public string Phone { get; set; }
        public string FullName { get; set; }
        public string ShopName { get; set; }
        public string RegEmail { get; set; }

    }

    public class Meta
    {
        public int error_code { get; set; }
        public string error_message { get; set; }
        public Meta(int error_code, string error_message)
        {
            this.error_code = error_code;
            this.error_message = error_message;
        }
    }
}