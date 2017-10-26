using System.Web;
using System.Web.Optimization;

namespace FToolsV2
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new StyleBundle("~/Content/css").Include(
                   //"~/lib/dist/css/bootstrap.min.css",
                   "~/Content/ngDialog.min.css",
                   "~/Content/angular-material.css"
                   // "~/develop/css/styleMain.css",
                   //"~/develop/css/color.css",
                   //"~/develop/fonts/font-awesome/css/font-awesome.min.css",
                   //"~/develop/slides-img/css-zoom/css_product.css",
                   //"~/homeFull/styleHomFull.css"
                   ));

            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                       "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js"));

            bundles.Add(new ScriptBundle("~/bundles/angularjs")
                .Include(
                "~/Scripts/angular.min.js",
                "~/Scripts/angular-mocks.js",
                "~/Scripts/angular-route.min.js",
                "~/Scripts/ngdialog.min.js",
                "~/Scripts/ng-file-upload.min.js",
                "~/Scripts/angular-md5.js",
                "~/Scripts/angular-masonry.min.js",
                "~/Scripts/angular-ui/ui-bootstrap.min.js",
                "~/Scripts/angular-ui/ui-bootstrap-tpls.min.js",
                "~/Scripts/angular-timeago.min.js",
                "~/Scripts/Chart.bundle.js",
                "~/Scripts/angular-chart.min.js",
                "~/Scripts/moment.js",
                "~/Scripts/datetimepicker.js",
                "~/Scripts/datetimepicker.templates.js",
                "~/Scripts/loading-bar.min.js",
                "~/Scripts/export/ngPrint.min.js",
                "~/Scripts/export/FileSaver.min.js",
                "~/Scripts/export/json-export-excel.min.js",
                "~/Scripts/angular-animate.min.js",
                "~/Scripts/angular-aria.min.js",
                "~/Scripts/angular-messages.min.js",
                "~/Scripts/angular-material.min.js",
                "~/Scripts/angular-translate.min.js",
                "~/Scripts/angular-translate-loader-static-files.min.js",
                "~/Scripts/angular-translate-storage-cookie.min.js",
                "~/Scripts/angular-translate-storage-local.min.js",
                "~/Scripts/angular-cookies.min.js",
                "~/Scripts/angular-owl-carousel-2.js",
                "~/Scripts/app/app.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/export").Include(
                "~/Scripts/export/tableExport.js",
                "~/Scripts/export/base64.js",
                "~/Scripts/export/jquery.base64.js",
                "~/Scripts/export/jspdf.js",
                "~/Scripts/export/sprintf.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/report").Include(
                "~/Scripts/reports/js/pdfmake.js",
                "~/Scripts/reports/js/vfs_fonts.js"
                ));

            bundles.IgnoreList.Clear();
            BundleTable.EnableOptimizations = false;
        }
    }
}
