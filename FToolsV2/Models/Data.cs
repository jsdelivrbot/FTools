using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FToolsV2.Models
{
    public class Page
    {
        public string id { get; set; }
        public string name { get; set; }
        public int PageId { get; set; }
        public Nullable<bool> isSubscribed { get; set; }
    }

    public class PageDTO
    {
        public Nullable<int> PageId { get; set; }
        public Nullable<int> ShopId { get; set; }
        public string PageFacebookId { get; set; }
        public string PageFacebookToken { get; set; }
        public string PageName { get; set; }
        public Nullable<int> Status { get; set; }
        public Nullable<DateTime> CreatedAt { get; set; }
        public Nullable<DateTime> UpdatedAt { get; set; }
        public Nullable<int> IsSubscribed { get; set; }
    }

    public class Dashboard
    {
        public int dashboard_id { get; set; }
        public int target_id { get; set; }
        public string target_type { get; set; }
    }
}