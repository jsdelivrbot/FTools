var myApp = angular.module('FToolApp', ['ngPrint', 'ngJsonExportExcel', 'ngDialog', 'ngMd5', 'ngRoute', 'wu.masonry', 'ui.bootstrap', 'ngFileUpload', 'ui.bootstrap.datetimepicker', 'angular-loading-bar', 'yaru22.angular-timeago', 'chart.js', 'ngMaterial', 'pascalprecht.translate', 'ngCookies', 'firebase', 'ngSanitize', 'daterangepicker', 'angular-owl-carousel-2', 'google-chart']);

myApp.config(['$translateProvider', function ($translateProvider) {
    $translateProvider.useStaticFilesLoader({
        prefix: '/localizations/',
        suffix: '.json'
    });

    $translateProvider.preferredLanguage('vi_VN');

    $translateProvider.useLocalStorage();
}])

myApp.config(function () {
    var config = {
        apiKey: "AIzaSyDqqNH42bX3dd1yG5GlCj1HT81HFl05rmQ",
        authDomain: "ftool-e3f43.firebaseapp.com",
        databaseURL: "https://ftool-e3f43.firebaseio.com",
        projectId: "ftool-e3f43",
        storageBucket: "ftool-e3f43.appspot.com",
        messagingSenderId: "805005434110"
    };
    firebase.initializeApp(config);
});

myApp.factory('app', function () {
    return {
        data: {
            domain: 'https://messenger.fb.sale',
            access_token: '',
            userId: -1
        },
        updateData: function (userId, access_token) {
            // Improve this method as needed
            this.data.userId = userId;
            this.data.access_token = access_token;
        }
    };
});

myApp.factory('dictionary', ['$http', '$rootScope', '$q', 'app', function ($http, $rootScope, $q, app) {
    var branches;
    var employees;
    var provinces;
    var customerGroups;
    var categories;
    var manufactures;
    var pageAvatar;
    var top;
    

    this.getTop = function (pageId, order_by) {
        //console.log(pageId + "--" + order_by);
        return top = $http.get("/api/app/getPost?id=" + pageId + "&query=1=1&page=1&page_size=3&order_by=" + order_by);//.success(function (data, status, headers) {})
        //    return top = data.data;
        //}).error(function (data, status, headers, config) {
        //});
       
        //if (isNeedRefresh || branches == undefined) {
        //    branches = $http.get(app.data.domain + "/api/shops/" + app.data.shopId + "/branches", { headers: { "Authorization": "bearer " + app.data.access_token } });
        //    return branches;
        //}
        //else
        //    return branches;
    }

    this.getBranches = function (isNeedRefresh) {
        if (isNeedRefresh || branches == undefined) {
            branches = $http.get(app.data.domain + "/api/shops/" + app.data.shopId + "/branches", { headers: { "Authorization": "bearer " + app.data.access_token } });
            return branches;
        }
        else
            return branches;
    }

    this.getEmployees = function (isNeedRefresh) {
        if (isNeedRefresh || employees == undefined) {
            employees = $http.get(app.data.domain + "/api/shops/" + app.data.shopId + "/employees?page=1&page_size=50", { headers: { "Authorization": "bearer " + app.data.access_token } });
            return employees;
        }
        else
            return employees;
    }

    this.getProvinces = function (isNeedRefresh) {
        if (isNeedRefresh || provinces == undefined) {
            provinces = $http.get(app.data.domain + "/api/provinces", { headers: { "Authorization": "bearer " + app.data.access_token } });
            return provinces;
        }
        else
            return provinces;
    }

    this.getCustomerGroups = function (isNeedRefresh) {
        if (isNeedRefresh || customerGroups == undefined) {
            customerGroups = $http.get(app.data.domain + "/api/shops/" + app.data.shopId + "/customerGroups", { headers: { "Authorization": "bearer " + app.data.access_token } });
            return customerGroups;
        }
        else
            return customerGroups;
    }

    this.getCategories = function (isNeedRefresh) {
        if (isNeedRefresh || categories == undefined) {
            categories = $http.get(app.data.domain + "/api/shops/" + app.data.shopId + "/categories", { headers: { "Authorization": "bearer " + app.data.access_token } });
            return categories;
        }
        else
            return categories;
    }

    this.getManufactures = function (isNeedRefresh) {
        if (isNeedRefresh || manufactures == undefined) {
            manufactures = $http.get(app.data.domain + "/api/shops/" + app.data.shopId + "/manufactures?page=1&page_size=50", { headers: { "Authorization": "bearer " + app.data.access_token } });
            return manufactures;
        }
        else
            return manufactures;
    }

    this.setPageAvatar = function (avatar) {
        pageAvatar = avatar;
        $rootScope.$broadcast('onDetailLoaded', avatar);
    }

    return {
        getBranches: this.getBranches,
        getEmployees: this.getEmployees,
        getProvinces: this.getProvinces,
        getCustomerGroups: this.getCustomerGroups,
        getCategories: this.getCategories,
        getManufactures: this.getManufactures,
        setPageAvatar: this.setPageAvatar,
        getTop: this.getTop
    }
}]);

myApp.config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
}])

myApp.filter('iif', function () {
    return function (input, trueValue, falseValue) {
        return input ? trueValue : falseValue;
    };
});

myApp.config(['timeAgoSettings', function (timeAgoSettings) {
    timeAgoSettings.strings.vi_VN = {
        prefixAgo: null,
        prefixFromNow: null,
        suffixAgo: 'trước',
        suffixFromNow: 'từ bây giờ',
        seconds: 'nhỏ hơn 1 phút',
        minute: 'khoảng 1 phút',
        minutes: '%d phút',
        hour: 'khoảng 1 giờ',
        hours: 'khoảng %d giờ',
        day: 'một ngày',
        days: '%d ngày',
        month: 'khoảng 1 tháng',
        months: '%d tháng',
        year: 'khoảng 1 năm',
        years: '%d năm',
        numbers: []
    };
}]);

myApp.factory("fileReader", ["$q", "$log", function ($q, $log) {
    var onLoad = function (reader, deferred, scope) {
        return function () {
            scope.$apply(function () {
                deferred.resolve(reader.result);
            });
        };
    };

    var onError = function (reader, deferred, scope) {
        return function () {
            scope.$apply(function () {
                deferred.reject(reader.result);
            });
        };
    };

    var onProgress = function (reader, scope) {
        return function (event) {
            scope.$broadcast("fileProgress",
                {
                    total: event.total,
                    loaded: event.loaded
                });
        };
    };

    var getReader = function (deferred, scope) {
        var reader = new FileReader();
        reader.onload = onLoad(reader, deferred, scope);
        reader.onerror = onError(reader, deferred, scope);
        reader.onprogress = onProgress(reader, scope);
        return reader;
    };

    var readAsDataURL = function (file, scope) {
        var deferred = $q.defer();

        var reader = getReader(deferred, scope);
        reader.readAsDataURL(file);

        return deferred.promise;
    };

    return {
        readAsDataUrl: readAsDataURL
    };
}]);

myApp.directive('fb', ['$FB', function ($FB) {
    return {
        restrict: "E",
        replace: true,
        template: "<div id='fb-root'></div>",
        compile: function (tElem, tAttrs) {
            return {
                post: function (scope, iElem, iAttrs, controller) {
                    var fbAppId = iAttrs.appId || '';

                    var fb_params = {
                        appId: iAttrs.appId || "",
                        cookie: iAttrs.cookie || true,
                        status: iAttrs.status || true,
                        xfbml: iAttrs.xfbml || true
                    };

                    // Setup the post-load callback
                    window.fbAsyncInit = function () {
                        $FB._init(fb_params);

                        if ('fbInit' in iAttrs) {
                            iAttrs.fbInit();
                        }
                    };

                    (function (d, s, id, fbAppId) {
                        var js, fjs = d.getElementsByTagName(s)[0];
                        if (d.getElementById(id)) return;
                        js = d.createElement(s); js.id = id; js.async = true;
                        js.src = "//connect.facebook.net/en_US/all.js";
                        fjs.parentNode.insertBefore(js, fjs);
                    }(document, 'script', 'facebook-jssdk', fbAppId));
                }
            }
        }
    };
}]);

myApp.factory('$FB', ['$rootScope', function ($rootScope) {

    var fbLoaded = false;

    // Our own customisations
    var _fb = {
        loaded: fbLoaded,
        _init: function (params) {
            if (window.FB) {
                // FIXME: Ugly hack to maintain both window.FB
                // and our AngularJS-wrapped $FB with our customisations
                angular.extend(window.FB, _fb);
                angular.extend(_fb, window.FB);

                // Set the flag
                _fb.loaded = true;

                // Initialise FB SDK
                window.FB.init(params);

                if (!$rootScope.$$phase) {
                    $rootScope.$apply();
                }
            }
        }
    }

    return _fb;
}]);

myApp.directive('attributeset', function () {
    return {
        restrict: 'E',
        replace: false,

        scope: {
            attributes: "="
        },
        templateUrl: '/Scripts/directive/attribute.html',
        link: function (scope, element, attrs) {
            scope.attrs = { "data": [] };
            scope.internalControl = scope.control || {};
            scope.addAttr = function () {
                //check exist
                var isDup = false;
                for (var i = 0; i < scope.attrs.data.length; i++) {
                    if (scope.attrs.data[i].AttributeId == parseInt(scope.newAttr.AttributeId) || scope.newAttr.AttributeId == "-1")
                        isDup = true;
                }
                if (isDup)
                    return;
                if (!scope.newAttr.Value || /^\s*$/.test(scope.newAttr.Value))
                    return;
                scope.attrs.data.push(scope.newAttr);
                scope.newAttr = { "AttributeId": "-1", "Value": "" };
            }
            scope.deleteAttr = function (id) {
                //check exist                
                for (var i = 0; i < scope.attrs.data.length; i++) {
                    if (scope.attrs.data[i].AttributeId == id)
                        scope.attrs.data.splice(i, 1);
                }
            }
            scope.findName = function (id) {
                var name = "";
                for (var i = 0; i < scope.attributes.length; i++) {
                    if (scope.attributes[i].AttributeId == parseInt(id))
                        name = scope.attributes[i].AttributeName;
                }
                return name;
            }
            scope.Delete = function (e) {
                //remove element and also destoy the scope that element
                element.remove();
                scope.$destroy();
            }
        }
    };
});

myApp.directive('productunit', function () {
    return {
        restrict: 'E',
        replace: false,
        scope: {
        },
        templateUrl: '/Scripts/directive/unit.html',
        link: function (scope, element, attrs) {
            scope.Delete = function (e) {
                //remove element and also destoy the scope that element
                element.remove();
                scope.$destroy();
            }
        }
    };
});

myApp.directive('productimage', ['fileReader', function (fileReader) {
    return {
        restrict: 'E',
        replace: false,
        templateUrl: '/Scripts/directive/productImage.html',
        link: function ($scope, element, attrs) {
            $scope.Delete = function (e, name) {
                if ($scope.files == undefined || $scope.files.length > 0) {
                    var index = 0;
                    for (var i = 0; i < $scope.files.length; i++) {
                        if (name == $scope.files[i].name)
                            index = i;
                    }
                    //remove
                    $scope.files.splice(index, 1);
                    if ($scope.isEditing)
                        $scope.edit.addedImages.splice(index, 1);
                    else
                        $scope.new.addedImages.splice(index, 1);
                }
            }

            $scope.loadImage = function (file) {
                fileReader.readAsDataUrl(file, $scope)
                    .then(function (result) {
                        file.base64String = result;
                    });
            }
        }
    };
}]);

myApp.directive('format', ['$filter', function ($filter) {
    return {
        require: '?ngModel',
        link: function (scope, elem, attrs, ctrl) {
            if (!ctrl) return;

            ctrl.$formatters.unshift(function (a) {
                return $filter(attrs.format)(ctrl.$modelValue, "", 0)
            });

            elem.bind('blur', function (event) {
                var plainNumber = elem.val().replace(/[^\d|\-+|\.+]/g, '');
                elem.val($filter(attrs.format)(plainNumber, "", 0));
            });
        }
    };
}]);

myApp.directive("ngFileSelect", function () {

    return {
        link: function ($scope, el) {

            el.bind("change", function (e) {
                //check file exists
                var currentFiles = $scope.files;
                //check ext                
                var selectedFiles = (e.srcElement || e.target).files;
                var isValid = true;
                for (var i = 0; i < selectedFiles.length; i++) {
                    var ext = selectedFiles[i].name.split('.').pop();
                    if ("jpg|jpeg|png|bmp|gif|JPG|JPEG|PNG|bmp|GIF".indexOf(ext) == -1)
                        isValid = false;
                }
                if (!isValid)
                    return;
                if (currentFiles != undefined && currentFiles.length > 0) {
                    if (selectedFiles != undefined && selectedFiles.length > 0) {
                        for (var i = 0; i < selectedFiles.length; i++) {
                            var isDup = false;
                            for (var j = 0; j < currentFiles.length; j++) {
                                if (selectedFiles[i].name == currentFiles[j].name) {
                                    isDup = true;
                                    break;
                                }
                            }
                            if (!isDup) {
                                $scope.files.push(selectedFiles[i]);
                                if ($scope.isEditing)
                                    $scope.edit.addedImages.push(selectedFiles[i]);
                                else
                                    $scope.new.addedImages.push(selectedFiles[i]);
                                $scope.$apply();
                            }
                        }
                    }
                }
                else {
                    var files = (e.srcElement || e.target).files;
                    $scope.files = new Array();
                    for (var i = 0; i < files.length; i++) {
                        //$scope.getFile(files[i]);
                        $scope.files.push(files[i]);
                        if ($scope.isEditing)
                            $scope.edit.addedImages.push(selectedFiles[i]);
                        else
                            $scope.new.addedImages.push(selectedFiles[i]);
                        $scope.$apply();
                    }
                }
            })

        }

    }
})

myApp.directive('inputEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.inputEnter);
                });

                event.preventDefault();
            }
        });
    };
});

myApp.directive('whenScrolled', function () {
    return function (scope, elm, attr) {
        var raw = elm[0];

        elm.bind('scroll', function () {
            if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
                scope.$apply(attr.whenScrolled);
            }
        })
    }
});

myApp.directive('loadingPane', function ($timeout, $window) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            var directiveId = 'loadingPane';

            var targetElement;
            var paneElement;
            var throttledPosition;

            function init(element) {
                targetElement = element;

                paneElement = angular.element('<div>');
                paneElement.addClass('loading-pane');

                if (attr['id']) {
                    paneElement.attr('data-target-id', attr['id']);
                }

                var spinnerImage = angular.element('<div>');
                spinnerImage.addClass('spinner-image');
                spinnerImage.appendTo(paneElement);

                angular.element('body').append(paneElement);

                setZIndex();

                //reposition window after a while, just in case if:
                // - watched scope property will be set to true from the beginning
                // - and initial position of the target element will be shifted during page rendering
                $timeout(position, 100);
                $timeout(position, 200);
                $timeout(position, 300);

                throttledPosition = _.throttle(position, 50);
                angular.element($window).scroll(throttledPosition);
                angular.element($window).resize(throttledPosition);
            }

            function updateVisibility(isVisible) {
                if (isVisible) {
                    show();
                } else {
                    hide();
                }
            }

            function setZIndex() {
                var paneZIndex = 500;

                paneElement.css('zIndex', paneZIndex).find('.spinner-image').css('zIndex', paneZIndex + 1);
            }

            function position() {
                paneElement.css({
                    'left': targetElement.offset().left,
                    'top': targetElement.offset().top - $(window).scrollTop(),
                    'width': targetElement.outerWidth(),
                    'height': targetElement.outerHeight()
                });
            }

            function show() {
                paneElement.show();
                position();
            }

            function hide() {
                paneElement.hide();
            }

            init(element);

            scope.$watch(attr[directiveId], function (newVal) {
                updateVisibility(newVal);
            });

            scope.$on('$destroy', function cleanup() {
                paneElement.remove();
                $(window).off('scroll', throttledPosition);
                $(window).off('resize', throttledPosition);
            });
        }
    };
});

//Xuất excel
myApp.factory('Excel', ['$window', function ($window) {
    var uri = 'data:application/vnd.ms-excel;base64,',
        template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
        base64 = function (s) { return $window.btoa(unescape(encodeURIComponent(s))); },
        format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) };
    return {
        report: function (tableId, worksheetName) {
            var table = $(tableId),
                ctx = { worksheet: worksheetName, table: table.html() },
                href = uri + base64(format(template, ctx));
            return href;
        }
    };
}]);

myApp.filter('trusted', ['$sce', function ($sce) {
    return $sce.trustAsResourceUrl;
}]);

//Export Table
myApp.directive('exportTable', function () {
    var link = function ($scope, elm, attr) {
        $scope.$on('export-pdf', function (e, d) {
            elm.tableExport({ type: 'pdf', escape: false });
        });
        $scope.$on('export-excel', function (e, d) {
            elm.tableExport({ type: 'excel', escape: false });
        });
        $scope.$on('export-doc', function (e, d) {
            elm.tableExport({ type: 'doc', escape: false });
        });
        $scope.$on('export-csv', function (e, d) {
            elm.tableExport({ type: 'csv', escape: false });
        });
    }
    return {
        restrict: 'C',
        link: link
    }
});

//Đinh dạng giá
myApp.filter("displayprice", function () {
    return function (input) {
        //console.log("displayprice: " + input);
        input = (typeof input === 'undefined' || input === '') ? "" : input + "";
        if (parseInt(input) === 0) {
            input = 0 + "";
        }
        var comma = ".";
        var num = parseInt(input) ? parseInt(input.replace(/\./g, '')) : input;
        //var num = parseInt(input) ? parseInt(input.replace(/[^\d|\-+|\.+]/g, '')) : input;

        //console.log("displayprice2: " + input);
        var nums = 0;
        if (num >= 0) {
            nums = num;
        }
        else {
            nums = 0 - num;
        }
        nums = nums + "";

        var str = "";

        var k = (nums.length % 3);
        if (k > 0) {
            str += nums.substring(0, k) + comma;
        }

        while (k < nums.length) {

            str += nums.substring(k, k + 3) + comma;
            k = k + 3;
        }
        if (num >= 0) {
            str = str.substring(0, str.length - 1);
        }
        else {
            str = "-" + str.substring(0, str.length - 1);
        }
        return str;
    }
});

myApp.filter("formatPrice", function () {
    return function (price, digits, thoSeperator, decSeperator, bdisplayprice) {
        var i;
        price = (typeof price === "undefined") ? 0 : price;
        digits = (typeof digits === "undefined") ? 0 : digits;
        bdisplayprice = (typeof bdisplayprice === "undefined") ? true : bdisplayprice;
        thoSeperator = (typeof thoSeperator === "undefined") ? "." : thoSeperator;
        decSeperator = (typeof decSeperator === "undefined") ? "," : decSeperator;
        price = (typeof price === "") ? "0" : price;

        if (price != 0) {
            var prices = 0 - price;
            if (price > 0) {
                prices = price;
            }
            prices = prices + "";
            var _temp = prices.split('.');
            var dig = (typeof _temp[1] === "undefined") ? "00" : _temp[1];
            if (bdisplayprice && parseInt(dig, 10) === 0) {
                dig = "";
            } else {
                dig = dig + "";
                if (dig.length > digits) {
                    dig = (Math.round(parseFloat("0." + dig) * Math.pow(10, digits))) + "";
                }
                for (i = dig.length; i < digits; i++) {
                    dig += "0";
                }
            }
            var num = _temp[0];
            var s = "",
                ii = 0;
            for (i = num.length - 1; i > -1; i--) {
                s = ((ii++ % 3 === 2) ? ((i > 0) ? thoSeperator : "") : "") + num.substr(i, 1) + s;
            }
        }
        else {
            s = 0;
        }

        if (price < 0) {
            s = '- ' + s;;
        }
        if (dig > 0) {
            return s + decSeperator + dig;
        }
        else {
            return s;
        }
    }
});

//Đinh dạng độ dài chuỗi
myApp.filter("displaystring", function () {
    return function (input, k) {
        input = (typeof input === 'undefined' || input === '') ? "" : input + "";
        var str = input.length > k ? input.substring(0, input.substring(0, k).lastIndexOf(' ')) + "..." : input
        return str;
    }
});

// chuyen chu hoa thanh chu thuong va chuyen tieng viet khong dau thanh co dau
myApp.formatSpecialchar = function (ystring) {
    if (ystring) {
        ystring = ystring.toLowerCase();
        ystring = ystring.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a").replace(/đ/g, "d").replace(/đ/g, "d").replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y").replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u").replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ.+/g, "o").replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ.+/g, "e").replace(/ì|í|ị|ỉ|ĩ/g, "i").replace(/&/g, "");
    }
    else {
        ystring = '';
    }
    return ystring;
}

//landing page
myApp.controller('LandingPageController', ['$scope', '$http', 'app', 'ngDialog', 'md5', '$window', 'cfpLoadingBar', '$mdDialog', '$mdToast', '$FB', '$filter', '$firebaseArray', '$translate', function LandingPageController($scope, $http, app, ngDialog, md5, $window, cfpLoadingBar, $mdDialog, $mdToast, $FB, $filter, $firebaseArray, $translate) {

    $scope.page = 1;
    $scope.page_size = 10;
    $scope.query = "1=1";
    $scope.type = 0;
    $scope.queryexim = "1=1";
    $scope.q = {};
    $scope.orderby = "";
    $scope.item_count = 0;
    $scope.selectCountry = "";

    $scope.countLinked = 0;
    $scope.loggedFacebookUserId = "";

    $scope.init = function () {
        $scope.getTopPageByCountry();
        //$scope.getTopPageFan();
        $scope.getTopGroup();
        $scope.loadCountry();
        //$scope.updatePage();
        $scope.getNewGroup();
        $scope.getGroupByMemberIncrease();
        //$scope.getPostOnSystem();

        if ($scope.IsLogged == 1) {
            cfpLoadingBar.complete();
        }
        else {
            $scope.Group = "";
        }
    }

    $scope.$watch(function () { return $FB.loaded }, function () {
        if ($FB.loaded) {
            if ($scope.IsLogged == 1) {
                cfpLoadingBar.complete();
            }
            else {
                $scope.Group = "";
            }
        }
    });

    $scope.loginFacebookOld = function (type, idg) {
        cfpLoadingBar.start();
        $FB.login(function (response) {

            if (response.authResponse) {
                access_token = response.authResponse.accessToken; //get access token
                user_id = response.authResponse.userID; //get FB UID
                $scope.loggedFacebookUserId = response.authResponse.userID;
                //angular.element(document.querySelector('#loginModal')).modal('toggle');
                $FB.api('/me?fields=email,name,id', function (response) {
                    user_email = response.email; //get user email

                    var apiUrl = '/api/app/loginfacebook';

                    var login = {
                        email: user_email,
                        id: user_id,
                        token: access_token,
                        name: response.name
                    };

                    var post = $http({
                        method: "POST",
                        url: apiUrl,
                        data: login
                    });

                    post.success(function successCallback(data, status, headers, config) {
                        // success      
                        //cfpLoadingBar.complete();
                        ///Shared/BoxLogin
                        //if (data.meta != null && data.meta != undefined) {
                        //if (data.meta.error_code == 200) {
                        //    cfpLoadingBar.complete();

                        var apiUrlFSale = '/api/app/loginfacebookFSale';
                        var post = $http({
                            method: "POST",
                            url: apiUrlFSale,
                            data: login
                        });
                        post.success(function successCallback(data, status, headers, config) {
                            $("#boxLogin").load("/Shared/BoxLogin", function (data) {
                                var target = $compile(data)($scope);
                                $("#boxLogin").html(target);
                            });

                            if (type == 0) {
                                $window.location.href = '/index.html';
                            }
                            else if (type == 1) {
                                $window.location.href = '/detail/' + idg + '/group.html';
                            }

                        })
                        .error(function (data, status, headers, config) { // optional
                            $mdDialog.show(
                                $mdDialog.alert()
                                    .clickOutsideToClose(true)
                                    .title($translate.instant('dashboard.info'))
                                    .textContent($translate.instant('alert.login_failed'))
                                    .ok($translate.instant('common.close'))
                                    .fullscreen(false)
                            );
                        });


                        //    }
                        //    else if (data.meta.error_code == 500) {
                        //        //redirect
                        //        cfpLoadingBar.complete();
                        //        $mdDialog.show(
                        //            $mdDialog.alert()
                        //                .clickOutsideToClose(true)
                        //                .title($translate.instant('dashboard.info'))
                        //                .textContent($translate.instant('alert.registration_failed_exit'))
                        //                .ok($translate.instant('common.close'))
                        //                .fullscreen(false)
                        //        );
                        //    }
                        //    else if (data.meta.error_code == 404) {
                        //        //redirect
                        //        cfpLoadingBar.complete();
                        //        $mdDialog.show(
                        //            $mdDialog.alert()
                        //                .clickOutsideToClose(true)
                        //                .title($translate.instant('dashboard.info'))
                        //                .textContent($translate.instant('alert.login_failed'))
                        //                .ok($translate.instant('common.close'))
                        //                .fullscreen(false)
                        //        );
                        //    }
                        //    else if (data.meta.error_code == 400) {
                        //        //redirect
                        //        cfpLoadingBar.complete();
                        //        $mdDialog.show(
                        //            $mdDialog.alert()
                        //                .clickOutsideToClose(true)
                        //                .title($translate.instant('dashboard.info'))
                        //                .textContent($translate.instant('alert.failed_process'))
                        //                .ok($translate.instant('common.close'))
                        //                .fullscreen(false)
                        //        );
                        //    }
                        //    else {
                        //        cfpLoadingBar.complete();
                        //        $mdDialog.show(
                        //            $mdDialog.alert()
                        //                .clickOutsideToClose(true)
                        //                .title($translate.instant('dashboard.info'))
                        //                .textContent($translate.instant('alert.login_failed'))
                        //                .ok($translate.instant('common.close'))
                        //                .fullscreen(false)
                        //        );
                        //    }
                        //}
                        //else {
                        //    $mdDialog.show(
                        //        $mdDialog.alert()
                        //            .clickOutsideToClose(true)
                        //            .title($translate.instant('dashboard.info'))
                        //            .textContent($translate.instant('alert.login_failed'))
                        //            .ok($translate.instant('common.close'))
                        //            .fullscreen(false)
                        //    );
                        //}
                    })
                        .error(function (data, status, headers, config) { // optional
                            $mdDialog.show(
                                $mdDialog.alert()
                                    .clickOutsideToClose(true)
                                    .title($translate.instant('dashboard.info'))
                                    .textContent($translate.instant('alert.login_failed'))
                                    .ok($translate.instant('common.close'))
                                    .fullscreen(false)
                            );
                        });
                });

            } else {
                //user hit cancel button

            }
        }, {
            scope: 'email,manage_pages,pages_messaging,pages_messaging_subscriptions,pages_messaging_phone_number,pages_show_list,publish_pages,read_page_mailboxes'
            //scope: 'email'
        });
    }

    $scope.loginFacebook = function () {
        cfpLoadingBar.start();
        $FB.login(function (response) {

            if (response.authResponse) {
                access_token = response.authResponse.accessToken; //get access token
                user_id = response.authResponse.userID; //get FB UID
                $scope.loggedFacebookUserId = response.authResponse.userID;
                angular.element(document.querySelector('#loginModal')).modal('toggle');
                $FB.api('/me?fields=email,name,id', function (response) {
                    user_email = response.email; //get user email

                    var apiUrl = '/api/app/loginfacebook';

                    var login = {
                        email: user_email,
                        id: user_id,
                        token: access_token,
                        name: response.name
                    };

                    var post = $http({
                        method: "POST",
                        url: apiUrl,
                        data: login
                    });

                    post.success(function successCallback(data, status, headers, config) {
                        // success      
                        cfpLoadingBar.complete();
                        ///Shared/BoxLogin
                        if (data.meta != null && data.meta != undefined) {
                            if (data.meta.error_code == 200) {
                                
                                cfpLoadingBar.complete();
                                $("#boxLogin").load("/Shared/BoxLogin", function (data) {
                                    var target = $compile(data)($scope);
                                    $("#boxLogin").html(target);
                                });
                                //pop up 
                                //if (data.Phone == null || data.Phone == undefined || data.Phone == "" || data.RegEmail == null || data.RegEmail == undefined || data.RegEmail == "") {
                                //    $scope.userInfo.Phone = data.Phone;
                                //    $scope.userInfo.FullName = data.FullName;
                                //    $scope.userInfo.ShopName = data.ShopName;
                                //    $scope.userInfo.Address = data.Address;
                                //    $scope.userInfo.RegEmail = data.RegEmail;
                                //    $scope.userInfo.access_token = data.access_token;
                                //    //dismiss modal                                   
                                //    angular.element(document.querySelector('#infoModal')).modal({ backdrop: 'static', keyboard: false })
                                //}
                                //else
                                    $scope.goDashboard();
                            }
                            else if (data.meta.error_code == 500) {
                                //redirect
                                cfpLoadingBar.complete();
                                $mdDialog.show(
                                    $mdDialog.alert()
                                        .clickOutsideToClose(true)
                                        .title($translate.instant('dashboard.info'))
                                        .textContent($translate.instant('alert.registration_failed_exit'))
                                        .ok($translate.instant('common.close'))
                                        .fullscreen(false)
                                );
                            }
                            else if (data.meta.error_code == 423) {
                                //redirect
                                cfpLoadingBar.complete();
                                $mdDialog.show(
                                    $mdDialog.alert()
                                        .clickOutsideToClose(true)
                                        .title($translate.instant('dashboard.info'))
                                        .textContent($translate.instant('alert.fail_lock_login'))
                                        .ok($translate.instant('common.close'))
                                        .fullscreen(false)
                                );
                            }
                            else if (data.meta.error_code == 404) {
                                //redirect
                                cfpLoadingBar.complete();
                                $mdDialog.show(
                                    $mdDialog.alert()
                                        .clickOutsideToClose(true)
                                        .title($translate.instant('dashboard.info'))
                                        .textContent($translate.instant('alert.login_failed'))
                                        .ok($translate.instant('common.close'))
                                        .fullscreen(false)
                                );
                            }
                            else if (data.meta.error_code == 400) {
                                //redirect
                                cfpLoadingBar.complete();
                                $mdDialog.show(
                                    $mdDialog.alert()
                                        .clickOutsideToClose(true)
                                        .title($translate.instant('dashboard.info'))
                                        .textContent($translate.instant('alert.failed_process'))
                                        .ok($translate.instant('common.close'))
                                        .fullscreen(false)
                                );
                            }
                            else {
                                cfpLoadingBar.complete();
                                $mdDialog.show(
                                    $mdDialog.alert()
                                        .clickOutsideToClose(true)
                                        .title($translate.instant('dashboard.info'))
                                        .textContent($translate.instant('alert.login_failed'))
                                        .ok($translate.instant('common.close'))
                                        .fullscreen(false)
                                );
                            }
                        }
                        else {
                            $mdDialog.show(
                                $mdDialog.alert()
                                    .clickOutsideToClose(true)
                                    .title($translate.instant('dashboard.info'))
                                    .textContent($translate.instant('alert.login_failed'))
                                    .ok($translate.instant('common.close'))
                                    .fullscreen(false)
                            );
                        }
                    })
                        .error(function (data, status, headers, config) { // optional
                            $mdDialog.show(
                                $mdDialog.alert()
                                    .clickOutsideToClose(true)
                                    .title($translate.instant('dashboard.info'))
                                    .textContent($translate.instant('alert.login_failed'))
                                    .ok($translate.instant('common.close'))
                                    .fullscreen(false)
                            );
                        });
                });

            } else {
                //user hit cancel button

            }
        }, {
                scope: 'email,manage_pages,pages_messaging,pages_messaging_subscriptions,pages_messaging_phone_number,pages_show_list,publish_pages,read_page_mailboxes'
                //scope: 'email'
            });
    }

    $scope.login = function () {
        cfpLoadingBar.start();
        var apiUrl = '/api/app/login';

        var email = angular.element(document.querySelector('#txtLoginEmail')).val();
        var password = angular.element(document.querySelector('#txtLoginPassword')).val();

        if (email == undefined || password == undefined || email == "" || password == "") {
            $mdDialog.show(
                $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title($translate.instant('dashboard.info'))
                    .textContent($translate.instant('alert.missing_data'))
                    .ok($translate.instant('common.close'))
            );
            return;
        }

        var login = {
            email: email,
            password: md5.createHash(password || '')
        };

        var post = $http({
            method: "POST",
            url: apiUrl,
            data: login
        });

        post.success(function successCallback(data, status, headers, config) {
            // success
            if (data.meta != null && data.meta != undefined) {
                if (data.meta.error_code == 200) {
                    cfpLoadingBar.complete();
                    $("#boxLogin").load("/Shared/BoxLogin", function (data) {
                        var target = $compile(data)($scope);
                        $("#boxLogin").html(target);
                    });
                    $scope.goDashboard();
                }
                else if (data.meta.error_code == 500) {
                    //redirect
                    cfpLoadingBar.complete();
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title($translate.instant('dashboard.info'))
                            .textContent($translate.instant('alert.registration_failed_exit'))
                            .ok($translate.instant('common.close'))
                    );
                }
                else if (data.meta.error_code == 404) {
                    //redirect
                    cfpLoadingBar.complete();
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title($translate.instant('dashboard.info'))
                            .textContent($translate.instant('alert.login_failed'))
                            .ok($translate.instant('common.close'))
                            .fullscreen(false)
                    );
                }
                else if (data.meta.error_code == 423) {
                    //redirect
                    cfpLoadingBar.complete();
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title($translate.instant('dashboard.info'))
                            .textContent($translate.instant('alert.fail_lock_login'))
                            .ok($translate.instant('common.close'))
                            .fullscreen(false)
                    );
                }
                else if (data.meta.error_code == 400) {
                    //redirect
                    cfpLoadingBar.complete();
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title($translate.instant('dashboard.info'))
                            .textContent($translate.instant('alert.failed_process'))
                            .ok($translate.instant('common.close'))
                            .fullscreen(false)
                    );
                }
                else {
                    cfpLoadingBar.complete();
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title($translate.instant('dashboard.info'))
                            .textContent($translate.instant('alert.login_failed'))
                            .ok($translate.instant('common.close'))
                            .fullscreen(false)
                    );
                }
            }
            else {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title($translate.instant('dashboard.info'))
                        .textContent($translate.instant('alert.login_failed'))
                        .ok($translate.instant('common.close'))
                        .fullscreen(false)
                );
            }
        })
            .error(function (data, status, headers, config) { // optional
                cfpLoadingBar.complete();
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(false)
                        .title($translate.instant('dashboard.info'))
                        .textContent($translate.instant('alert.login_failed'))
                        .ok($translate.instant('common.close'))
                        .fullscreen(false)
                );
            });
    }

    $scope.updateInfo = function () {
        var re = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@("@")[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if ($scope.userInfo.Phone == "" || $scope.userInfo.Phone == undefined || $scope.userInfo.RegEmail == "" || $scope.userInfo.RegEmail == undefined || !re.test($scope.userInfo.RegEmail)) {
            //return;
        }

        if ($scope.userInfo.Phone == undefined || $scope.userInfo.Phone == '') {
            $mdDialog.show(
                $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title($translate.instant('dashboard.info'))
                    .textContent($translate.instant('alert.input_type_phone'))
                    .ok($translate.instant('common.close'))
                    .fullscreen(true)
            );
            return;
        }

        if ($scope.userInfo.Email == undefined || $scope.userInfo.Email == '') {
            $mdDialog.show(
                $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title($translate.instant('dashboard.info'))
                    .textContent($translate.instant('alert.input_type_email'))
                    .ok($translate.instant('common.close'))
                    .fullscreen(true)
            );
            return;
        }

        var p = {
            FullName: $scope.userInfo.FullName,
            Phone: $scope.userInfo.Phone,
            Address: $scope.userInfo.Address,
            ShopName: $scope.userInfo.ShopName,
            Email: $scope.userInfo.RegEmail
        };

        var post = $http({
            method: "POST",
            url: "https://apiv1.fb.sale/api/shops/UpdateInfo",
            data: p,
            headers: { "Authorization": "bearer " + $scope.userInfo.access_token }
        });

        post.success(function successCallback(data, status, headers, config) {
            // success      
            $scope.goDashboard();
        })
            .error(function (data, status, headers, config) { // optional
                $scope.goSelectPage();
            });
    }

    $scope.goDashboard = function () {
        $window.location.href = '/index.html';
    }
    
    $scope.getTopPage = function () {
        var index = 1;
        $http.get("/api/app/getTopPage?query=" + $scope.query).success(function (data, status, headers) {
            if (data.meta.err_code == 200) {
                $scope.listTopPages = data.data;
                angular.forEach($scope.listTopPages, function (item, key) {
                    $http.get("/api/app/fetchInfo?id=" + item.facebook_id + "&type=0").success(function (data, status, headers) {
                        if (data.meta.err_code == 200) {
                            var statusId = data.data;
                            var ref = firebase.database().ref().child("tasks").child(statusId);
                            $firebaseArray(ref).$loaded(ref).then(function (data) {
                                data.$watch(function (event) {
                                    if (event.event == "child_added") {
                                        $scope.statusPage = true;
                                        $http.get("/api/app/findPage?id=" + item.facebook_id).success(function (data, status, headers) {
                                            if (data.meta.err_code == 200) {
                                                if (index == 10) {
                                                    $http.get("/api/app/getTopPage?query=" + $scope.query).success(function (data, status, headers) {
                                                        $scope.listTopPages = data.data;
                                                    }).error(function (data, status, headers, config) {
                                                        //cfpLoadingBar.complete();
                                                    });
                                                }
                                                else {
                                                    index++;
                                                }
                                            } else {
                                                console.log("Error!");
                                            }
                                        }).error(function (data, status, headers, config) {
                                        });
                                    }
                                });
                            });
                        }
                    }).error(function (data, status, headers, config) {
                        cfpLoadingBar.complete();
                    });
                });
            }
        }).error(function (data, status, headers, config) {
            //cfpLoadingBar.complete();
        });
    }

    $scope.getTopPageFanIncrease = function () {
        var order_by = "fan_increase_yesterday+desc";
        $http.get("/api/app/getAllPage?query=" + $scope.query + "&page=" + $scope.page + "&page_size=" + $scope.page_size + "&order_by=" + order_by).success(function (data, status, headers) {
            if (data.meta.err_code == 200) {
                $scope.listTopPagesFan = data.data;
            }
        }).error(function (data, status, headers, config) {
            cfpLoadingBar.complete();
        });
    }

    $scope.getNewPage = function () {
        var order_by = "created_at+desc";
        $http.get("/api/app/getAllPage?query=" + $scope.query + "&page=" + $scope.page + "&page_size=" + $scope.page_size + "&order_by=" + order_by).success(function (data, status, headers) {
            if (data.meta.err_code == 200) {
                $scope.listNewPages = data.data;
            }
        }).error(function (data, status, headers, config) {
            cfpLoadingBar.complete();
        });
    }

    $scope.getNewGroup = function () {
        var order_by = "created_at+desc";
        $http.get("/api/app/getAllGroup?query=" + $scope.query + "&page=" + $scope.page + "&page_size=" + $scope.page_size + "&order_by=" + order_by).success(function (data, status, headers) {
            if (data.meta.err_code == 200) {
                $scope.listNewGroups = data.data;
            }
        }).error(function (data, status, headers, config) {
            cfpLoadingBar.complete();
        });
    }

    $scope.getGroupByMemberIncrease = function () {
        var order_by = "member_increase_yesterday+desc";
        $http.get("/api/app/getAllGroup?query=" + $scope.query + "&page=" + $scope.page + "&page_size=" + $scope.page_size + "&order_by=" + order_by).success(function (data, status, headers) {
            if (data.meta.err_code == 200) {
                $scope.listGroupByMemberIncrease = data.data;
            }
        }).error(function (data, status, headers, config) {
            cfpLoadingBar.complete();
        });
    }

    $scope.getTopGroup = function () {
        var index = 1;
        $http.get("/api/app/getTopGroup").success(function (data, status, headers) {
            if (data.meta.err_code == 200) {
                $scope.listTopGroups = data.data;
                angular.forEach($scope.listTopGroups, function (item, key) {
                    $http.get("/api/app/fetchInfo?id=" + item.facebook_id + "&type=1").success(function (data, status, headers) {
                        if (data.meta.err_code == 200) {
                            var statusId = data.data;
                            var ref = firebase.database().ref().child("tasks").child(statusId);
                            $firebaseArray(ref).$loaded(ref).then(function (data) {
                                data.$watch(function (event) {
                                    if (event.event == "child_added") {
                                        $http.get("/api/app/findGroup?id=" + item.facebook_id).success(function (data, status, headers) {
                                            if (data.meta.err_code == 200) {
                                                if (index == 10) {
                                                    $http.get("/api/app/getTopGroup").success(function (data, status, headers) {
                                                        $scope.listTopGroups = data.data;
                                                    }).error(function (data, status, headers, config) {
                                                        //cfpLoadingBar.complete();
                                                    });
                                                }
                                                else {
                                                    index++;
                                                }
                                            } else {
                                                console.log("Error!");
                                            }
                                        }).error(function (data, status, headers, config) {
                                        });
                                    }
                                });
                            });
                        }
                    }).error(function (data, status, headers, config) {
                        cfpLoadingBar.complete();
                    });
                });
            }
        }).error(function (data, status, headers, config) {
            //cfpLoadingBar.complete();
        });
    }

    $scope.findPercent = function (percent) {
        return percent * 100;
    }

    // Lấy danh sách Top theo quốc gia truy cập hiện tại
    $scope.getTopPageByCountry = function () {
        $http.get("https://ipinfo.io/json").success(function (data, status, headers) {
            var query = "";
            $scope.crr_country = data.country;
            query = 'fan_by_country.country_code="' + $scope.crr_country + '"';
            $scope.query = query;
            $scope.getTopPage();
            $scope.getTopPageFanIncrease();
            $scope.getNewPage();
        }).error(function (data, status, headers, config) { });
    }

    $scope.loadCountry = function () {
        //$scope.listCountry = [];
        $http.get("/Content/json/countries.json").success(function (data) {
            $scope.listCountry = data;
        });
    }

    $scope.onQueryChange = function () {
        var query = "";

        if ($scope.crr_country != undefined) {
            if ($scope.crr_country != 0) {
                if (query != "") {
                    query += ' and fan_by_country.country_code="' + $scope.crr_country + '"';
                }
                else {
                    query += 'fan_by_country.country_code="' + $scope.crr_country + '"';
                }
            }
        }

        if (query == "")
            query = "1=1";
        $scope.query = query;
        $scope.getTopPage();
        $scope.getTopPageFanIncrease();
        $scope.getNewPage();
    }

    //Lấy bài viết tương tác nhiều nhất trên hệ thống
    $scope.getPostOnSystem = function () {
        var order_by = "total_interaction+desc";
        $http.get("/api/app/getPostOnSystem?page=" + $scope.page + "&page_size=" + $scope.page_size + "&query=" + $scope.query + "&order_by=" + order_by).success(function (data, status, headers) {
            if (data.meta.err_code == 200) {
                $scope.listNewPostOnSystem = data.data;
            }
        }).error(function (data, status, headers, config) {
            cfpLoadingBar.complete();
        });
    }

}]);

myApp.controller('HeadController', ['$scope', function HeadController($scope) {

    $scope.init = function () {
        $scope.metaTile = "";
        $scope.metaDescription = "";
    }

    $scope.$on('onMetaLoaded', function (event, data) {
        $scope.metaDescription = data;
    });


}]);

myApp.controller('DashboardController', ['$scope', '$http', 'ngDialog', 'md5', '$window', 'cfpLoadingBar', '$mdDialog', '$mdToast', '$FB', '$filter', '$firebaseArray', function DashboardController($scope, $http, ngDialog, md5, $window, cfpLoadingBar, $mdDialog, $mdToast, $FB, $filter, $firebaseArray) {

    $scope.page = 1;
    $scope.page_size = 10;
    $scope.query = "";
    $scope.type = 0;
    $scope.q = {};
    $scope.orderby = "";
    $scope.item_count = 0;
    $scope.dashboard = {};

    $scope.init = function () {
        //$scope.isPaneShown = true;
        //var ref = firebase.database().ref().child("Employee").child("2");
        //var listEmp = $firebaseArray(ref);
        //console.log("test:" + ref + " - " + listEmp);
        console.log($scope.userId);
        $scope.listPageOfUser();
    }

    $scope.findPageAndGroup = function () {
        $scope.query = $scope.textSearch;
        var searchResult = angular.element(document.querySelector('#searchResult'));
        $http.get("/api/app/findPageAndGroup?query=" + $scope.query + "&type=" + $scope.type).success(function (data, status, headers) {
            if (data.meta.err_code == 200) {
                $scope.resultSearchs = data.data;
                searchResult.removeClass('hide');
            }
        }).error(function (data, status, headers, config) {
            cfpLoadingBar.complete();
        });
    }

    $scope.addPage = function (resultSearch) {
        var loadingFanPage = angular.element(document.querySelector('#loadingFanPage'));
        loadingFanPage.removeClass('hide');
        var searchResult = angular.element(document.querySelector('#searchResult'));
        $scope.idPage = resultSearch.id;

        //$http.get("/api/app/fetchInfo?id=" + $scope.idPage + "&type=" + $scope.type).success(function (data, status, headers) {
        //    //add dashboard
        //    if (data.meta.err_code == 200) {

        //        $http.get("/api/app/findId?id=" + $scope.$scope.idPage).success(function (data, status, headers) {
        //            if (data.meta.err_code == 200) {

        //                $scope.dashboard.dashboard_id = $scope.userId;
        //                $scope.dashboard.target_id = data.data.page_id;
        //                $scope.dashboard.target_type = "page";

        //                var post = $http({
        //                    method: "POST",
        //                    url: "/api/app/createDashboard",
        //                    data: $scope.dashboard
        //                });

        //                post.success(function successCallback(data, status, headers, config) {
        //                    if (data.meta.err_code == 200) {
        //                        $mdDialog.show(
        //                            $mdDialog.alert()
        //                                .clickOutsideToClose(true)
        //                                .title('Thông tin')
        //                                .textContent('Thêm fanpage thành công!')
        //                                .ok('Đóng')
        //                                .fullscreen(true)
        //                        );
        //                    }
        //                    else {
        //                        $mdDialog.show(
        //                            $mdDialog.alert()
        //                                .clickOutsideToClose(true)
        //                                .title('Thông tin')
        //                                .textContent('Thêm fanpage thất bại, vui lòng thử lại sau!')
        //                                .ok('Đóng')
        //                                .fullscreen(true)
        //                        );
        //                    }
        //                })
        //                .error(function (data, status, headers, config) {
        //                    $mdDialog.show(
        //                        $mdDialog.alert()
        //                            .clickOutsideToClose(true)
        //                            .title('Thông tin')
        //                            .textContent('Thêm fanpage thất bại, vui lòng thử lại sau!')
        //                            .ok('Đóng')
        //                            .fullscreen(true)
        //                    );
        //                });

        //            }
        //        }).error(function (data, status, headers, config) {
        //            cfpLoadingBar.complete();
        //        });
        //    }
        //}).error(function (data, status, headers, config) {
        //    cfpLoadingBar.complete();
        //});

        //$http.get("/api/app/fetchInfo?id=" + $scope.idPage + "&type=" + $scope.type).success(function (data, status, headers) {
        //    if (data.meta.err_code == 200) {
        //        var statusId = data.data;
        //        var ref = firebase.database().ref().child("tasks").child(statusId);
        //        $firebaseArray(ref).$loaded(ref).then(function (data) {
        //            data.$watch(function (event) {
        //                if (event.event == "child_added") {
        //                    $scope.statusPage = true;
        //                    $http.get("/api/app/findPage?id=" + $scope.idPage).success(function (data, status, headers) {
        //                        if (data.meta.err_code == 200) {
        //                            $scope.dashboard.dashboard_id = $scope.userId;
        //                            $scope.dashboard.target_id = data.data.page_id;
        //                            $scope.dashboard.target_type = "page";

        //                            var post = $http({
        //                                method: "POST",
        //                                url: "/api/app/createDashboard",
        //                                data: $scope.dashboard
        //                            });

        //                            post.success(function successCallback(data, status, headers, config) {
        //                                if (data.meta.err_code == 200) {
        //                                    $mdDialog.show(
        //                                        $mdDialog.alert()
        //                                            .clickOutsideToClose(true)
        //                                            .title('Thông tin')
        //                                            .textContent('Thêm fanpage thành công!')
        //                                            .ok('Đóng')
        //                                            .fullscreen(true)
        //                                    );
        //                                }
        //                                else {
        //                                    $mdDialog.show(
        //                                        $mdDialog.alert()
        //                                            .clickOutsideToClose(true)
        //                                            .title('Thông tin')
        //                                            .textContent('Thêm fanpage thất bại, vui lòng thử lại sau!')
        //                                            .ok('Đóng')
        //                                            .fullscreen(true)
        //                                    );
        //                                }
        //                            })
        //                            .error(function (data, status, headers, config) {
        //                                $mdDialog.show(
        //                                    $mdDialog.alert()
        //                                        .clickOutsideToClose(true)
        //                                        .title('Thông tin')
        //                                        .textContent('Thêm fanpage thất bại, vui lòng thử lại sau!')
        //                                        .ok('Đóng')
        //                                        .fullscreen(true)
        //                                );
        //                            });
        //                        }
        //                    }).error(function (data, status, headers, config) {
        //                    });
        //                }
        //            });
        //        });
        //    }
        //}).error(function (data, status, headers, config) {
        //    cfpLoadingBar.complete();
        //});

        $http.get("/api/app/findPage?id=" + $scope.idPage).success(function (data, status, headers) {
            var checkPageExist = false;
            if (data.meta.err_code == 200) {
                $.each($scope.listPOU, function (key, value) {
                    if (data.data.page_id == value.page_id) {
                        checkPageExist = true;
                        return false;
                    }
                });

                if (!checkPageExist) {
                    $scope.dashboard.dashboard_id = $scope.userId;
                    $scope.dashboard.target_id = data.data.page_id;
                    $scope.dashboard.target_type = "page";

                    var post = $http({
                        method: "POST",
                        url: "/api/app/createDashboard",
                        data: $scope.dashboard
                    });

                    post.success(function (data, status, headers, config) {
                        if (data.meta.err_code == 200) {
                            $mdDialog.show(
                                $mdDialog.alert()
                                    .clickOutsideToClose(true)
                                    .title('Thông tin')
                                    .textContent('Thêm fanpage thành công!')
                                    .ok('Đóng')
                                    .fullscreen(true)
                            );
                        }
                        else {
                            $mdDialog.show(
                                $mdDialog.alert()
                                    .clickOutsideToClose(true)
                                    .title('Thông tin')
                                    .textContent('Thêm fanpage thất bại, vui lòng thử lại sau!')
                                    .ok('Đóng')
                                    .fullscreen(true)
                            );
                        }
                        loadingFanPage.addClass('hide');
                    })
                    .error(function (data, status, headers, config) {
                        $mdDialog.show(
                            $mdDialog.alert()
                                .clickOutsideToClose(true)
                                .title('Thông tin')
                                .textContent('Thêm fanpage thất bại, vui lòng thử lại sau!')
                                .ok('Đóng')
                                .fullscreen(true)
                        );
                    });
                    $scope.listPageOfUser();
                }
                else {
                    loadingFanPage.addClass('hide');
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('Thông báo')
                            .textContent('Pages đã tồn tại trong danh sách!')
                            .ok('Đóng')
                            .fullscreen(true)
                    );
                }

            }
            else
            {
                searchResult.addClass('hide');
                var check = true;
                $http.get("/api/app/fetchInfo?id=" + $scope.idPage + "&type=" + $scope.type).success(function (data, status, headers) {
                    if (data.meta.err_code == 200) {
                        var statusId = data.data;
                        var ref = firebase.database().ref().child("tasks").child(statusId);
                        $firebaseArray(ref).$loaded(ref).then(function (data) {
                            data.$watch(function (event) {
                                if (event.event == "child_added") {
                                    if (check) {
                                        check = false;
                                        $http.get("/api/app/findPage?id=" + $scope.idPage).success(function (data, status, headers) {
                                            if (data.meta.err_code == 200) {

                                                $scope.dashboard.dashboard_id = $scope.userId;
                                                $scope.dashboard.target_id = data.data.page_id;
                                                $scope.dashboard.target_type = "page";
                                                var post = $http({
                                                    method: "POST",
                                                    url: "/api/app/createDashboard",
                                                    data: $scope.dashboard
                                                });

                                                post.success(function successCallback(data, status, headers, config) {
                                                    if (data.meta.err_code == 200) {
                                                        $mdDialog.show(
                                                            $mdDialog.alert()
                                                                .clickOutsideToClose(true)
                                                                .title('Thông tin')
                                                                .textContent('Thêm fanpage thành công!')
                                                                .ok('Đóng')
                                                                .fullscreen(true)
                                                        );
                                                    }
                                                    else {
                                                        $mdDialog.show(
                                                            $mdDialog.alert()
                                                                .clickOutsideToClose(true)
                                                                .title('Thông tin')
                                                                .textContent('Thêm fanpage thất bại, vui lòng thử lại sau!')
                                                                .ok('Đóng')
                                                                .fullscreen(true)
                                                        );
                                                    }
                                                })
                                                .error(function (data, status, headers, config) {
                                                    $mdDialog.show(
                                                        $mdDialog.alert()
                                                            .clickOutsideToClose(true)
                                                            .title('Thông tin')
                                                            .textContent('Thêm fanpage thất bại, vui lòng thử lại sau!')
                                                            .ok('Đóng')
                                                            .fullscreen(true)
                                                    );
                                                });
                                                loadingFanPage.addClass('hide');
                                            }
                                        }).error(function (data, status, headers, config) { });
                                        $scope.listPageOfUser();
                                    }
                                }
                            });
                        });
                    }
                }).error(function (data, status, headers, config) {
                    cfpLoadingBar.complete();
                });
            }
        });

    }

    $scope.deletePage = function (did, page_name) {
        var confirm = $mdDialog.confirm()
            .title('Xác nhận')
            .textContent('Xóa page '+ page_name +' ra khỏi Dashboard?')
            .ok('Xác nhận')
            .cancel('Hủy');

        $mdDialog.show(confirm).then(function () {
            var actionDelete = $http({
                method: "POST",
                url: "/api/app/deleteDashBoard?id=" + $scope.userId + "&did=" + did
            });

            actionDelete.success(function (data, status, headers) {
                if (data.meta.err_code == 200) {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('Thông báo')
                            .textContent('Xóa thành công!')
                            .ok('Đóng')
                            .fullscreen(true)
                    );
                    $scope.listPageOfUser();
                }
                else {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('Thông báo')
                            .textContent('Xảy ra lỗi!')
                            .ok('Đóng')
                            .fullscreen(true)
                    );
                }
            });

            actionDelete.error(function (data, status, headers, config) { });
        }, function () {
        });       
    }

    $scope.listPageOfUser = function () {
        $http.get("/api/app/getDashBoard?id=" + $scope.userId).success(function (data, status, headers) {
            $scope.listPOU = data.data;
        }).error(function (data, status, headers, config) {
        });
    }

    $scope.findPercent = function (percent) {
        return percent * 100;
    }

    // Xuất Excel
    $scope.exportData = function () {
        var confirm = $mdDialog.confirm()
            .title('Thông báo')
            .textContent('Bạn có chắc muốn xuất file Excel từ bảng này này?')
            .ok('Đồng ý')
            .cancel('Hủy bỏ');

        $mdDialog.show(confirm).then(function () {
            if ($scope.listPOU.length <= 0) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('Thông báo')
                        .textContent('Danh sách đang trống!')
                        .ok('Đóng')
                        .fullscreen(true)
                     );
            }
            else {
                var date = moment();

                var options = {
                    sheetid: 'Danh sách page của bạn',
                    headers: true,
                }

                var array = [];
                array.push({
                    "STT": "STT",
                    "page_name": "Tên Page",
                    "engagement": "Chỉ số hiệu suất(%)",
                    "fan_count": "Số Fans",
                    "fan_growth_weekly": "Tăng trưởng trung bình hàng tuần(%)",
                    "post_interaction": "Tương tác bài đăng(%)",
                    "response_time": "Thời gian đáp ứng",
                    "post_per_day": "Bài đăng mỗi ngày",
                    "total_reach_per_day": "Số lượt truy cập mỗi ngày"
                });

                angular.forEach($scope.listPOU, function (item, key) {
                    array.push({
                        "STT": key + 1,
                        "page_name": item.page_name,
                        "engagement": item.engagement,
                        "fan_count": item.fan_count,
                        "fan_growth_weekly": item.fan_growth_weekly,
                        "post_interaction": item.post_interaction,
                        "response_time": item.response_time,
                        "post_per_day": item.post_per_day,
                        "total_reach_per_day": item.total_reach_per_day
                    });
                });

                alasql('SELECT * INTO XLSX("Danh sách page của bạn_' + date.format('DD/MM/YYYY') + '.xlsx",?) FROM ?', [options, array]);

            }
        });
    }


}]);

myApp.controller('SearchController', ['$scope', '$rootScope', '$http', 'app', 'ngDialog', 'md5', '$window', 'cfpLoadingBar', '$mdDialog', '$mdToast', '$filter', '$firebaseArray', function SearchController($scope, $rootScope, $http, app, ngDialog, md5, $window, cfpLoadingBar, $mdDialog, $mdToast, $filter, $firebaseArray) {
    $scope.query = "";
    $scope.type = 0;

    $scope.init = function () {
        cfpLoadingBar.start();
        
        $window.document.title = "Tìm kiếm Fanpage hoặc Group";
        $scope.metaDescription = "Tìm kiếm và hiển thị kết quả tìm kiếm các Fanpage hoặc Group trên Facebook"
        $rootScope.$broadcast('onMetaLoaded', $scope.metaDescription);
        
        var textSearch = $window.sessionStorage.getItem("textSearch");
        var typeSearch = $window.sessionStorage.getItem("typeSearch");

        if (textSearch != "") {
            if (typeSearch != "undefined") {
                $scope.type = typeSearch;

                var idTypePage = angular.element(document.querySelector('#idTypePage'));
                var idTypeGroup = angular.element(document.querySelector('#idTypeGroup'));
                if (typeSearch == 0) {
                    idTypePage.addClass('active');
                    idTypeGroup.removeClass('active');
                }
                else {
                    idTypeGroup.addClass('active');
                    idTypePage.removeClass('active');
                }
            }
            else {
                $scope.type = 0;
            }
            $scope.query = textSearch;
            $window.sessionStorage.setItem("textSearch", "");
        }

        if ($scope.type == 1) {
            $scope.searchGroup();
            
            $scope.searchUrl = '/Scripts/searchs/search-group.html';
            cfpLoadingBar.complete();
        }
        else {
            $scope.searchFanPage();

            $scope.searchUrl = '/Scripts/searchs/search-fanpage.html';
            
            cfpLoadingBar.complete();
        }

    }

    $scope.openSearch = function () {
        $window.sessionStorage.setItem("textSearch", $scope.textSearch);
        $window.sessionStorage.setItem("typeSearch", $scope.typeSearch);
        $window.location.href = '/search.html';
    }

    $scope.searchFanPage = function () {
        $http.get("/api/app/findPageAndGroup?query=" + $scope.query + "&type=" + $scope.type).success(function (data, status, headers) {
            if (data.meta.err_code == 200) {
                $scope.resultSearchFanpages = data.data;
                if ($scope.resultSearchFanpages.length == 1) {
                    $scope.addFanPage($scope.resultSearchFanpages[0]);
            }
            }
        }).error(function (data, status, headers, config) {
            //cfpLoadingBar.complete();
        });
    }

    $scope.searchGroup = function () {
        $http.get("/api/app/findPageAndGroup?query=" + $scope.query + "&type=" + $scope.type).success(function (data, status, headers) {
            if (data.meta.err_code == 200) {
                $scope.resultSearchGroups = data.data;
                if ($scope.resultSearchGroups.length == 1) {
                    //console.log($scope.resultSearchGroups[0])
                    $scope.addGroup($scope.resultSearchGroups[0]);
                }
                //console.log($scope.resultSearchGroups[0]["members.summary.total_count"])
            }
        }).error(function (data, status, headers, config) {
            //cfpLoadingBar.complete();
        });
    }

    $scope.addFanPage = function (resultSearchFanpage) {
        var loadingSearch = angular.element(document.querySelector('#loadingSearch'));
        var dataSearch = angular.element(document.querySelector('#dataSearch'));

        dataSearch.addClass('hide');
        loadingSearch.removeClass('hide');

        $scope.statusPage = true;
        $scope.idPage = resultSearchFanpage.id;
        $scope.nameFanPage = resultSearchFanpage.name;
        $scope.type = 0;

        if ($scope.statusPage) {
            $scope.statusPage = false;

            $http.get("/api/app/findPage?id=" + $scope.idPage).success(function (data, status, headers) {
                if (data.meta.err_code == 200) {
                    $scope.statusPage = true;
                    cfpLoadingBar.complete();
                    var url = '/detail/' + data.data.page_id + '/page.html';
                    $window.location.href = url;
                }
                else {
                    $http.get("/api/app/fetchInfo?id=" + $scope.idPage + "&type=" + $scope.type).success(function (data, status, headers) {
                        if (data.meta.err_code == 200) {
                            var statusId = data.data;
                            var ref = firebase.database().ref().child("tasks").child(statusId);
                            $firebaseArray(ref).$loaded(ref).then(function (data) {
                                data.$watch(function (event) {
                                    if (event.event == "child_added") {                                       
                                        $scope.statusPage = true;
                                        $http.get("/api/app/findPage?id=" + $scope.idPage).success(function (data, status, headers) {
                                            if (data.meta.err_code == 200) {
                                                var url = '/detail/' + data.data.page_id + '/page.html';
                                                $window.location.href = url;
                                            } else {
                                                dataSearch.removeClass('hide');
                                                loadingSearch.addClass('hide');
                                            }
                                        }).error(function (data, status, headers, config) {
                                            cfpLoadingBar.complete();
                                            dataSearch.removeClass('hide');
                                            loadingSearch.addClass('hide');
                                        });

                                    }
                                });
                            });
                        }
                    }).error(function (data, status, headers, config) {
                        cfpLoadingBar.complete();
                    });
                }
            }).error(function (data, status, headers, config) {
                cfpLoadingBar.complete();
            });

        }

    }

    $scope.addGroup = function (resultSearchGroup) {
        cfpLoadingBar.start();
        var loadingSearch = angular.element(document.querySelector('#loadingSearch'));
        var dataSearch = angular.element(document.querySelector('#dataSearch'));

        $scope.statusGroup = true;
        $scope.idGroup = resultSearchGroup.id;
        $scope.nameGroup = resultSearchGroup.name;
        $scope.type = 1;

        if ($scope.statusGroup) {
            $scope.statusGroup = false;

            $http.get("/api/app/findGroup?id=" + $scope.idGroup).success(function (data, status, headers) {
                if (data.meta.err_code == 200) {
                    $scope.statusGroup = true;
                    var url = '/detail/' + data.data.group_id + '/group.html';
                    $window.location.href = url;
                }
                else {
                    //if ($scope.token == "undefined" || $scope.token == "") {
                    //    var confirm = $mdDialog.confirm()
                    //                .title('Thông báo')
                    //                .textContent('Bạn cần đăng nhập để xem thông tin nhóm!')
                    //                .ok('Đăng nhập')
                    //                .cancel('Tiếp tục tìm kiếm');

                    //    $mdDialog.show(confirm).then(function () {
                    //        $window.location.href = '/index.html';
                    //    }, function () {
                    //        $window.location.href = '/search.html';
                    //    });
                    //}
                    //else {

                        dataSearch.addClass('hide');
                        loadingSearch.removeClass('hide');

                        $http.get("/api/app/fetchInfo?id=" + $scope.idGroup + "&type=" + $scope.type).success(function (data, status, headers) {
                            if (data.meta.err_code == 200) {
                                var statusId = data.data;
                                var ref = firebase.database().ref().child("tasks").child(statusId);
                                $firebaseArray(ref).$loaded(ref).then(function (data) {
                                    data.$watch(function (event) {
                                        if (event.event == "child_added") {
                                            $scope.statusGroup = true;
                                            $http.get("/api/app/findGroup?id=" + $scope.idGroup).success(function (data, status, headers) {
                                                if (data.meta.err_code == 200) {
                                                    $scope.dataGroup = data.data;
                                                    var url = '/detail/' + $scope.dataGroup.group_id + '/group.html';
                                                    $window.location.href = url;

                                                    //if (data.data.privacy == "SECRET") {
                                                    //    $http.get("/api/app/fetchSecretGroup?id=" + $scope.idGroup + "&token=" + $scope.token).success(function (data, status, headers) {
                                                    //        if (data.meta.err_code == 200) {
                                                    //            console.log("fetchSecretGroup" + data.data);
                                                    //            var statusId2 = data.data;
                                                    //            var ref = firebase.database().ref().child("tasks").child(statusId2);
                                                    //            $firebaseArray(ref).$loaded(ref).then(function (data) {
                                                    //                data.$watch(function (event) {
                                                    //                    if (event.event == "child_added") {
                                                    //                        $http.get("/api/app/fetchGroupPost?id=" + $scope.idGroup + "&token=" + $scope.token).success(function (data, status, headers) {
                                                    //                            if (data.meta.err_code == 200) {
                                                    //                                console.log("fetchGroupPost" + data.data);
                                                    //                                var statusId3 = data.data;
                                                    //                                var ref = firebase.database().ref().child("tasks").child(statusId3);
                                                    //                                $firebaseArray(ref).$loaded(ref).then(function (data) {
                                                    //                                    data.$watch(function (event) {
                                                    //                                        if (event.event == "child_added") {
                                                    //                                            var url = '/detail/' + $scope.dataGroup.group_id + '/group.html';
                                                    //                                            $window.location.href = url;
                                                    //                                        }
                                                    //                                    });
                                                    //                                });
                                                    //                            }
                                                    //                        }).error(function (data, status, headers, config) {
                                                    //                            cfpLoadingBar.complete();
                                                    //                        });
                                                    //                    }
                                                    //                });
                                                    //            });
                                                    //        }
                                                    //    }).error(function (data, status, headers, config) {
                                                    //        cfpLoadingBar.complete();
                                                    //    });
                                                    //}
                                                    //else {
                                                    //    $http.get("/api/app/fetchGroupPost?id=" + $scope.idGroup + "&token=" + $scope.token).success(function (data, status, headers) {
                                                    //        if (data.meta.err_code == 200) {
                                                    //            console.log("fetchGroupPost" + data.data);
                                                    //            var statusId2 = data.data;
                                                    //            var ref = firebase.database().ref().child("tasks").child(statusId2);
                                                    //            $firebaseArray(ref).$loaded(ref).then(function (data) {
                                                    //                data.$watch(function (event) {
                                                    //                    if (event.event == "child_added") {
                                                    //                        var url = '/detail/' + $scope.dataGroup.group_id + '/group.html';
                                                    //                        $window.location.href = url;
                                                    //                    }
                                                    //                });
                                                    //            });
                                                    //        }
                                                    //    }).error(function (data, status, headers, config) {
                                                    //        cfpLoadingBar.complete();
                                                    //    });
                                                    //}
                                                                                }
                                                                            }).error(function (data, status, headers, config) {
                                                                                cfpLoadingBar.complete();
                                                                            });

                                        }
                                    });
                                });
                            }
                        }).error(function (data, status, headers, config) {
                            cfpLoadingBar.complete();
                        });
                    //}
                    }
            }).error(function (data, status, headers, config) {
                cfpLoadingBar.complete();
            });
        }

    }

    $scope.changeTypeSearch = function (type) {
        $scope.typeSearch = type;
        var idTypePage = angular.element(document.querySelector('#idTypePage'));
        var idTypeGroup = angular.element(document.querySelector('#idTypeGroup'));
        if (type == 0) {
            idTypePage.addClass('active');
            idTypeGroup.removeClass('active');
        }
        else {
            idTypeGroup.addClass('active');
            idTypePage.removeClass('active');
        }
        //$window.sessionStorage.setItem("typeSearch", type);
    }

}]);

myApp.controller('DetailPageController', ['$scope', '$rootScope', '$http', 'app', 'dictionary', 'ngDialog', 'md5', '$window', 'cfpLoadingBar', '$mdDialog', '$mdToast', '$FB', '$filter', '$compile', '$sce', '$firebaseArray', function DetailPageController($scope, $rootScope, $http, app, dictionary, ngDialog, md5, $window, cfpLoadingBar, $mdDialog, $mdToast, $FB, $filter, $compile, $sce, $firebaseArray) {

    $scope.page = 1;
    $scope.page_size = 10;
    $scope.page_size_top = 3;
    $scope.query = "1=1";
    $scope.order_by = "facebook_created_at+desc";
    $scope.q = {};
    $scope.item_count = 0;
    $scope.queryDate = "";
    $scope.queryType = "";
    $scope.isLoading = 1;
    $scope.statusSort = 8;
    $scope.newPage = {};

    $scope.init = function () {
        $scope.metaDescription = "Kết quả phân tích chi tiết fanpage ";        
        if ($scope.pageId != undefined) {
            //$scope.typedate = 8;
            //$scope.formatDate();
            //$scope.getPost();
            //$scope.loadDetailPage();
            //$scope.newPost();
            //$scope.getTopLike();
            //$scope.getTopLove();
            //$scope.getTopHaha();
            //$scope.getTopWow();
            //$scope.getTopSad();
            //$scope.getTopAnger();
            $scope.getWord();
            $scope.getHashTag();
            $scope.getRelatedPage();
            //$scope.getFanByCountries();
            $scope.getDetailPlusPage();
            $scope.chartHistoryPost();
        }
    }

    //$scope.$watch(function () { return $FB.loaded }, function () {
    //    if ($FB.loaded) {
    //        if ($scope.IsLogged == 1) {
    //            cfpLoadingBar.complete();
    //        }
    //        else {
    //            $scope.Group = "";
    //        }
    //    }
    //});

    $scope.getPost = function () {
        //$scope.order_by = "facebook_created_at+desc";
        $http.get("/api/app/getPost?id=" + $scope.pageId + "&query=" + $scope.query + "&page=" + $scope.page + "&page_size=" + $scope.page_size + "&order_by=" + $scope.order_by).success(function (data, status, headers) {
            $scope.item_count = data.meta_data.item_count;
            $scope.detailStats = data.data;
            //}
        }).error(function (data, status, headers, config) {
            cfpLoadingBar.complete();
        });
    }

    //Sắp xếp danh sách bài đăng theo các chỉ số Like, Love, Haha, Wow, Sad, Anger, Share, Comment, Date
    $scope.typeSort = "desc";
    $scope.toogleSort = false;

    $scope.getTop = function (index) {
        var order_by = "";

        if ($scope.statusSort == index) {
            if ($scope.toogleSort)
                $scope.typeSort = "desc";
            else
                $scope.typeSort = "asc";
            $scope.toogleSort = !$scope.toogleSort;
        }

        switch (index) {
            case 0:
                order_by = "like_count+" + $scope.typeSort;
                $scope.statusSort = 0;
                break;
            case 1:
                order_by = "love_count+" + $scope.typeSort;
                $scope.statusSort = 1;
                break;
            case 2:
                order_by = "haha_count+" + $scope.typeSort;
                $scope.statusSort = 2;
                break;
            case 3:
                order_by = "wow_count+" + $scope.typeSort;
                $scope.statusSort = 3;
                break;
            case 4:
                order_by = "sad_count+" + $scope.typeSort;
                $scope.statusSort = 4;
                break;
            case 5:
                order_by = "anger_count+" + $scope.typeSort;
                $scope.statusSort = 5;
                break;
            case 6:
                order_by = "share_count+" + $scope.typeSort;
                $scope.statusSort = 6;
                break;
            case 7:
                order_by = "comment_count+" + $scope.typeSort;
                $scope.statusSort = 7;
                break;
            case 8:
                order_by = "facebook_created_at+" + $scope.typeSort;
                $scope.statusSort = 8;
                break;
            case 9:
                order_by = "view_count+" + $scope.typeSort;
                $scope.statusSort = 9;
                break;
            default:
                break;
        }
        $scope.order_by = order_by;
        $scope.getPost();

    }

    //Lấy Top Like
    $scope.getTopLike = function () {
        $http.get("/api/app/getPost?id=" + $scope.pageId + "&query=" + $scope.query + "&page=" + $scope.page + "&page_size=" + $scope.page_size_top + "&order_by=like_count+desc").success(function (data, status, headers) {
            $scope.listTopLike = data.data;
        }).error(function (data, status, headers, config) {
            cfpLoadingBar.complete();
        });
    }

    //Lấy Top Love
    $scope.getTopLove = function () {
        $http.get("/api/app/getPost?id=" + $scope.pageId + "&query=" + $scope.query + "&page=" + $scope.page + "&page_size=" + $scope.page_size_top + "&order_by=love_count+desc").success(function (data, status, headers) {
            $scope.listTopLove = data.data;
            
        }).error(function (data, status, headers, config) {
            cfpLoadingBar.complete();
        });
    }

    //Lấy Top Haha
    $scope.getTopHaha = function () {
        $http.get("/api/app/getPost?id=" + $scope.pageId + "&query=" + $scope.query + "&page=" + $scope.page + "&page_size=" + $scope.page_size_top + "&order_by=haha_count+desc").success(function (data, status, headers) {
            $scope.listTopHaha = data.data;
        }).error(function (data, status, headers, config) {
            cfpLoadingBar.complete();
        });
    }

    //Lấy Top Wow
    $scope.getTopWow = function () {
        $http.get("/api/app/getPost?id=" + $scope.pageId + "&query=" + $scope.query + "&page=" + $scope.page + "&page_size=" + $scope.page_size_top + "&order_by=wow_count+desc").success(function (data, status, headers) {
            $scope.listTopWow = data.data;
        }).error(function (data, status, headers, config) {
            cfpLoadingBar.complete();
        });
    }

    //Lấy Top Sad
    $scope.getTopSad = function () {
        $http.get("/api/app/getPost?id=" + $scope.pageId + "&query=" + $scope.query + "&page=" + $scope.page + "&page_size=" + $scope.page_size_top + "&order_by=sad_count+desc").success(function (data, status, headers) {
            $scope.listTopSad = data.data;
        }).error(function (data, status, headers, config) {
            cfpLoadingBar.complete();
        });
    }

    //Lấy Top Anger
    $scope.getTopAnger = function () {
        $http.get("/api/app/getPost?id=" + $scope.pageId + "&query=" + $scope.query + "&page=" + $scope.page + "&page_size=" + $scope.page_size_top + "&order_by=anger_count+desc").success(function (data, status, headers) {
            $scope.listTopAnger = data.data;
        }).error(function (data, status, headers, config) {
            cfpLoadingBar.complete();
        });
    }

    //Lấy Top Comment
    $scope.getTopComment = function () {
        $scope.order_by = "comment_count+desc";
        $http.get("/api/app/getPost?id=" + $scope.pageId + "&query=" + $scope.query + "&page=" + $scope.page + "&page_size=" + $scope.page_size + "&order_by=" + $scope.order_by).success(function (data, status, headers) {
            $scope.detailStats = data.data;
        }).error(function (data, status, headers, config) {
            cfpLoadingBar.complete();
        });
    }

    //Lấy Top Share
    $scope.getTopShare = function () {
        $scope.order_by = "share_count+desc";
        $http.get("/api/app/getPost?id=" + $scope.pageId + "&query=" + $scope.query + "&page=" + $scope.page + "&page_size=" + $scope.page_size + "&order_by=" + $scope.order_by).success(function (data, status, headers) {
            $scope.detailStats = data.data;
        }).error(function (data, status, headers, config) {
            cfpLoadingBar.complete();
        });
    }

    $scope.onPageSizeChange = function () {
        $scope.page = 1;
        $scope.query = $scope.queryDate + $scope.queryType;
        $scope.getPost();
    }

    $scope.onPageChange = function () {
        //$scope.order_by = "facebook_created_at+desc";
        $scope.query = $scope.queryDate + $scope.queryType;
        $scope.getPost();
    }

    $scope.onQueryChange = function () {
        $scope.queryType = "";
        //$scope.order_by = "facebook_created_at+desc";
        $scope.page = 1;
        if ($scope.q.type != '-1' && $scope.q.type != undefined) {
            switch ($scope.q.type) {
                case '0':
                    $scope.queryType += " and type.Contains(\"video\")";
                    break;
                case '1':
                    $scope.queryType += " and type.Contains(\"photo\")";
                    break;
                case '2':
                    $scope.queryType += " and type.Contains(\"link\")";
                    break;
                case '3':
                    $scope.queryType += " and type.Contains(\"status\")";
                default:
                    break;
            }
        }

        if ($scope.q.txtSearch != undefined && $scope.q.txtSearch != '') {
                $scope.queryType += ' and (content.Contains(\"' + $scope.q.txtSearch + '\"))';
        }

        $scope.query = $scope.queryDate + $scope.queryType;
        $scope.getPost();
    }

    //Lấy thông tin chi tiết của trang
    $scope.loadDetailPage = function () {
        $http.get("/api/app/getDetailPage?id=" + $scope.pageId).success(function (data, status, headers) {
            $scope.DetailPage = data.data;
            //$scope.pageDescription = $sce.trustAsHtml($scope.DetailPage.page_description);
        }).error(function (data, status, headers, config) {
            cfpLoadingBar.complete();
        });
    }

    //
    $scope.like = {};
    $scope.getDetailPlusPage = function () {
        var startDate = moment().startOf('isoWeek');
        var endDate = moment().endOf('isoWeek');
        var crrDate = moment().subtract(1, 'days');

        $http.get("/api/app/getDetailPageDaily?id=" + $scope.pageId + "&start_date=" + startDate.format("DD-MM-YYYY") + "&end_date=" + endDate.format("DD-MM-YYYY")).success(function (data, status, headrs) {
            if (data.meta.err_code == 200) {
                var totalFanIncreaseWeek = 0;
                angular.forEach(data.data, function (item, key) {
                    totalFanIncreaseWeek += item.fan_count_increase_today;
                });
                $scope.like.fanIncreaseWeek = totalFanIncreaseWeek;
            }
        });

        $http.get("/api/app/getDetailPageDaily?id=" + $scope.pageId + "&start_date=" + crrDate.format("DD-MM-YYYY") + "&end_date=" + crrDate.format("DD-MM-YYYY")).success(function (data, status, headrs) {
            if (data.meta.err_code == 200) {
                var totalFanIncrease = 0;
                angular.forEach(data.data, function (item, key) {
                    totalFanIncrease += item.fan_count_increase_today;
                });
                $scope.like.fanIncreaseDay = totalFanIncrease;
            }
        });
    }

    //Lấy bài 3 bài viết mới nhất
    $scope.newPost = function () {
        $http.get("/api/app/getPost?id=" + $scope.pageId + "&query=" + $scope.query + "&page=" + $scope.page + "&page_size=3&order_by=facebook_created_at+desc").success(function (data, status, headers) {
            $scope.newPosts = data.data;
        }).error(function (data, status, headers, config) {
            cfpLoadingBar.complete();
        });
    }

    //Lấy từ được sử dụng nhiều nhất
    $scope.getWord = function () {
        $http.get("/api/app/getWord?id=" + $scope.pageId).success(function (data, status, headers) {
            $scope.listWord = data.data;
        }).error(function (data, status, headers, config) {
            cfpLoadingBar.complete();
        });
    }

    //Lấy HashTag
    $scope.getHashTag = function () {
        $http.get("/api/app/getHashTag?id=" + $scope.pageId).success(function (data, status, headers) {
            $scope.HashTags = data.data;
        }).error(function (data, status, headers, config) {
            cfpLoadingBar.complete();
        });
    }

    $scope.findPercent = function (percent) {
        return percent * 100;
    }

    //Lấy danh sách Related Page 
    $scope.getRelatedPage = function () {
        $http.get("/api/app/getRelatedPage?id=" + $scope.pageId).success(function (data, status, headers) {
            if (data.meta.err_code == 200) {
                $scope.listRelatedPages = data.data;
            }
        }).error(function (data, status, headers, config) {
            //cfpLoadingBar.complete();
        });
    }

    //Biểu đồ lịch sử bài đăng
    $scope.typedate = 2;
    $scope.queryreport = "1=1";
    $scope.queryreportfull = $scope.queryreport;
    $scope.r = {};
    $scope.loadReportOrder = function () {
        $http.get(app.data.domain + "/api/reports/" + app.data.shopId + "/sale-time-chart?query=" + $scope.queryreport, { headers: { "Authorization": "bearer " + app.data.access_token } }).success(function (data, status, headers) {
            cfpLoadingBar.complete();
            if (data.meta.error_code == 200) {
                $scope.orderreport = data.data;
                //get chart data
                $scope.chart.labels = new Array();
                $scope.chart.data = new Array();
                for (var i = 0; i < $scope.orderreport.length; i++) {
                    $scope.chart.labels.push($scope.orderreport[i].Day + "/" + $scope.orderreport[i].Month);
                    $scope.chart.data.push($scope.orderreport[i].TotalPrice);
                }
            }
        }).error(function (data, status, headers, config) {
        });
    }

    $scope.loadReportOrderFull = function () {
        $http.get(app.data.domain + "/api/reports/" + app.data.shopId + "/sale-time-chart?query=" + $scope.queryreportfull, { headers: { "Authorization": "bearer " + app.data.access_token } }).success(function (data, status, headers) {
            cfpLoadingBar.complete();
            if (data.meta.error_code == 200) {
                $scope.orderreportfull = data.data;
                //get chart data
                $scope.chartfull.labels = new Array();
                $scope.chartfull.data = new Array();
                for (var i = 0; i < $scope.orderreportfull.length; i++) {
                    $scope.chartfull.labels.push($scope.orderreportfull[i].Day + "/" + $scope.orderreportfull[i].Month);
                    $scope.chartfull.data.push($scope.orderreportfull[i].TotalPrice);
                }
            }
        }).error(function (data, status, headers, config) {
        });
    }

    //chart opiton
    $scope.chart = {};
    $scope.chart.options = {
        type: 'bar',
        tooltips: {
            enabled: true,
            mode: 'single',
            callbacks: {
                label: function (tooltipItem, data) {
                    var label = data.labels[tooltipItem.index];
                    var datasetLabel = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                    return $translate.instant('appitem.total_turnover') + $filter("displayprice")(datasetLabel, "", 0) + $translate.instant('dashboard.unit_value') + "."
                }
            }
        },
        scales: {
            yAxes: [{
                stacked: true,
                ticks: {
                    callback: function (value, index, values) {
                        return $filter("displayprice")(value, "", 0) + $translate.instant('appitem.sort_unit_value')
                    }
                }
            }]
        }
    }

    // Chọn thời gian
    $scope.date = {
        startDate: moment().subtract(7, "days"),
        endDate: moment().subtract(0, 'days')
    };

    //Lấy thời gian là tuần hiện tại
    $scope.opts = {
        locale: {
            applyClass: 'btn-green',
            applyLabel: "Áp dụng",
            fromLabel: "Từ",
            //format: "YYYY-MM-DD",
            format: "DD/MM/YYYY",
            toLabel: "Đến",
            cancelLabel: 'Hủy',
            customRangeLabel: 'Tùy chọn'
        },
        ranges: {
            '7 ngày trước': [moment().subtract(7, 'days'), moment().subtract(0, 'days')],
            'Tuần này': [moment().startOf('isoWeek'), moment().endOf('isoWeek')],
            'Tuần trước': [moment().subtract(1, 'weeks').startOf('isoWeek'), moment().subtract(1, 'weeks').endOf('isoWeek')],
            '30 ngày trước': [moment().subtract(30, 'days'), moment().subtract(1, 'days')],
            'Tháng này': [moment().startOf('Month'), moment().endOf('Month')],
            'Tháng trước': [moment().subtract(1, 'months').startOf('Month'), moment().subtract(1, 'months').endOf('Month')]
        }
    };

    //Watch for date changes
    $scope.$watch('date', function (newDate) {
        $scope.order_by = "facebook_created_at+desc";
        $scope.statusSort = 8;
        $scope.queryDate = "";
        $scope.queryDate += "facebook_created_at >= DateTime(" + newDate.startDate._d.getFullYear() + "," + (newDate.startDate._d.getMonth() + 1) + "," + newDate.startDate._d.getDate() + ",0,0,0) AND facebook_created_at <= DateTime(" + newDate.endDate._d.getFullYear() + "," + (newDate.endDate._d.getMonth() + 1) + "," + newDate.endDate._d.getDate() + ",23,59,59)";

        $scope.startDate = newDate.startDate._d.getDate() + "-" + (newDate.startDate._d.getMonth() + 1) + "-" + newDate.startDate._d.getFullYear();
        $scope.endDate = newDate.endDate._d.getDate() + "-" + (newDate.endDate._d.getMonth() + 1) + "-" + newDate.endDate._d.getFullYear();
        $scope.query = $scope.queryDate + $scope.queryType;

        var loadingFanPage = angular.element(document.querySelector('#loadingFanPage'));
        var updateFanPage = angular.element(document.querySelector('#updateFanPage'));
        var dataFanPage = angular.element(document.querySelector('#dataFanPage'));

        if ($scope.isLoading == 1) {
            $http.get("/api/app/getDetailPage?id=" + $scope.pageId).success(function (data, status, headers) {
                if (data.meta.err_code == 200) {
                    $scope.isLoading = 0;
                    $scope.DetailPage = data.data;
                    $scope.metaDescription += $scope.DetailPage.page_name;
                    $window.document.title = "Chi tiết fanpage " + $scope.DetailPage.page_name;
                    $rootScope.$broadcast('onMetaLoaded', $scope.metaDescription);

                    $http.get("/api/app/getPost?id=" + $scope.pageId + "&query=" + $scope.query + "&page=" + $scope.page + "&page_size=" + $scope.page_size + "&order_by=" + $scope.order_by).success(function (data, status, headers) {
                        if (data.meta.err_code == 200) {
                            $scope.item_count = data.meta_data.item_count;
                            $scope.detailStats = data.data;

                            if ($scope.item_count > 0) {
                                loadingFanPage.addClass('hide');
                                updateFanPage.removeClass('hide');
                                dataFanPage.removeClass('hide');

                                $scope.newPost();
                                $scope.getWord();
                                $scope.getHashTag();
                                $scope.query = $scope.queryDate;
                                $scope.$watch(function () { return $FB.loaded }, function () {
                                    if ($FB.loaded) {
                                        $scope.getTopLike();
                                        $scope.getTopLove();
                                        $scope.getTopHaha();
                                        $scope.getTopWow();
                                        $scope.getTopSad();
                                        $scope.getTopAnger();
                                        FB.XFBML.parse();
                                    }
                                });

                                $scope.fetchInfoPage();
                                $scope.fetchPagePost();
                            }
                            else {
                                loadingFanPage.removeClass('hide');
                                updateFanPage.addClass('hide');
                                dataFanPage.addClass('hide');

                                $scope.fetchInfoPage();
                                $scope.fetchPagePost();
                            }
                        }
                        else {
                            loadingFanPage.removeClass('hide');
                            updateFanPage.addClass('hide');
                            dataFanPage.addClass('hide');

                            $scope.fetchInfoPage();
                            $scope.fetchPagePost();
                        }
                    }).error(function (data, status, headers, config) {
                        cfpLoadingBar.complete();
                    }); 

                 }
            }).error(function (data, status, headers, config) {
                cfpLoadingBar.complete();
            });  
        }
        else {
            $http.get("/api/app/getPost?id=" + $scope.pageId + "&query=" + $scope.query + "&page=" + $scope.page + "&page_size=" + $scope.page_size + "&order_by=" + $scope.order_by).success(function (data, status, headers) {
                if (data.meta.err_code == 200) {                            
                    $scope.item_count = data.meta_data.item_count;
                    $scope.detailStats = data.data;

                    if ($scope.item_count > 0) {
                        loadingFanPage.addClass('hide');
                        updateFanPage.removeClass('hide');
                        dataFanPage.removeClass('hide');

                        $scope.newPost();
                        $scope.getWord();
                        $scope.getHashTag();
                        $scope.query = $scope.queryDate;
                        $scope.$watch(function () { return $FB.loaded }, function () {
                            if ($FB.loaded) {

                                $scope.getTopLike();
                                $scope.getTopLove();
                                $scope.getTopHaha();
                                $scope.getTopWow();
                                $scope.getTopSad();
                                $scope.getTopAnger();
                                FB.XFBML.parse();
                            }
                        });

                        $scope.fetchPagePost();
                    }
                    else {
                        loadingFanPage.removeClass('hide');
                        updateFanPage.addClass('hide');
                        dataFanPage.addClass('hide');

                        $scope.fetchPagePost();
                    }
                }
                else {
                    loadingFanPage.removeClass('hide');
                    updateFanPage.addClass('hide');
                    dataFanPage.addClass('hide');

                    $scope.fetchPagePost();
                }
            }).error(function (data, status, headers, config) {
                cfpLoadingBar.complete();
            });           
        }
    }, false);

    $scope.fetchInfoPage = function () {
        // Cập nhật lại thông tin Page
        $http.get("/api/app/fetchInfo?id=" + $scope.DetailPage.facebook_id + "&type=0").success(function (data, status, headers) {
            if (data.meta.err_code == 200) {
                var statusId = data.data;
                var ref = firebase.database().ref().child("tasks").child(statusId);
                $firebaseArray(ref).$loaded(ref).then(function (data) {
                    data.$watch(function (event) {
                        //var loadingFanPage = angular.element(document.querySelector('#loadingFanPage'));
                        //var updateFanPage = angular.element(document.querySelector('#updateFanPage'));
                        //var dataFanPage = angular.element(document.querySelector('#dataFanPage'));
                        if (event.event == "child_added") {
                            $http.get("/api/app/findPage?id=" + $scope.DetailPage.facebook_id).success(function (data, status, headers) {
                                if (data.meta.err_code == 200) {
                                    $http.get("/api/app/getDetailPage?id=" + $scope.pageId).success(function (data, status, headers) {
                                        $scope.DetailPage = data.data;

                                        //$scope.fetchPagePost();

                                        $scope.getWord();
                                        $scope.getHashTag();
                                        $scope.query = $scope.queryDate;

                                        //loadingFanPage.addClass('hide');
                                        //updateFanPage.addClass('hide');
                                        //dataFanPage.removeClass('hide');

                                        //$scope.q.type = "-1";

                                        //$scope.getPost();
                                        //$scope.newPost();
                                        //$scope.getTopLike();
                                        //$scope.getTopLove();
                                        //$scope.getTopHaha();
                                        //$scope.getTopWow();
                                        //$scope.getTopSad();
                                        //$scope.getTopAnger();
                                        //FB.XFBML.parse();

                                    }).error(function (data, status, headers, config) {
                                        //$scope.fetchPagePost();
                                        //cfpLoadingBar.complete();
                                        //loadingFanPage.addClass('hide');
                                        //updateFanPage.addClass('hide');
                                        //dataFanPage.removeClass('hide');
                                    });
                                } else {
                                    //$scope.fetchPagePost();
                                    //cfpLoadingBar.complete();
                                    //loadingFanPage.addClass('hide');
                                    //updateFanPage.addClass('hide');
                                    //dataFanPage.removeClass('hide');
                                }
                            }).error(function (data, status, headers, config) {
                                //$scope.fetchPagePost();
                                //cfpLoadingBar.complete();
                                //loadingFanPage.addClass('hide');
                                //updateFanPage.addClass('hide');
                                //dataFanPage.removeClass('hide');
                            });
                        }
                    });
                });
            }
        }).error(function (data, status, headers, config) {
            //cfpLoadingBar.complete();
        });
    }

    //Load thêm post
    $scope.fetchPagePost = function () {
        $http.get("/api/app/fetchPagePost?id=" + $scope.DetailPage.facebook_id + "&startDate=" + $scope.startDate + "&endDate=" + $scope.endDate).success(function (data, status, headers) {
            if (data.meta.err_code == 200) {
                var loaded = false;
                var statusId = data.data;
                var ref = firebase.database().ref().child("tasks").child(statusId);
                $firebaseArray(ref).$loaded(ref).then(function (data) {
                    data.$watch(function (event) {
                        if (!loaded) {
                            loaded = true;
                            var loadingFanPage = angular.element(document.querySelector('#loadingFanPage'));
                            var updateFanPage = angular.element(document.querySelector('#updateFanPage'));
                            var dataFanPage = angular.element(document.querySelector('#dataFanPage'));
                            if (event.event == "child_added") {
                                $http.get("/api/app/findPage?id=" + $scope.DetailPage.facebook_id).success(function (data, status, headers) {
                                    if (data.meta.err_code == 200) {
                                        loadingFanPage.addClass('hide');
                                        updateFanPage.addClass('hide');
                                        dataFanPage.removeClass('hide');

                                        $scope.q.type = "-1";
                                        $scope.q.txtSearch = "";

                                        $scope.getPost();
                                        $scope.newPost();
                                        $scope.getTopLike();
                                        $scope.getTopLove();
                                        $scope.getTopHaha();
                                        $scope.getTopWow();
                                        $scope.getTopSad();
                                        $scope.getTopAnger();
                                        $scope.chartHistoryPost();
                                        FB.XFBML.parse();
                                    }
                                    else {
                                        cfpLoadingBar.complete();
                                        loadingFanPage.addClass('hide');
                                        updateFanPage.addClass('hide');
                                        dataFanPage.removeClass('hide');
                                    }
                                }).error(function (data, status, headers, config) {
                                    cfpLoadingBar.complete();
                                    loadingFanPage.addClass('hide');
                                    updateFanPage.addClass('hide');
                                    dataFanPage.removeClass('hide');
                                });

                            }
                        }
                    });
                });
            }
        }).error(function (data, status, headers, config) {
            cfpLoadingBar.complete();
        });
    }

    //Xuất Excel
    $scope.exportData = function () {
        var confirm = $mdDialog.confirm()
            .title('Thông báo')
            .textContent('Bạn có chắc muốn xuất file Excel từ bảng này này?')
            .ok('Đồng ý')
            .cancel('Hủy bỏ');
        $mdDialog.show(confirm).then(function () {
            var page = 1;
            var page_size = $scope.item_count;

            $http.get("/api/app/getPost?id=" + $scope.pageId + "&query=" +  $scope.query + "&page=" + page + "&page_size=" + page_size + "&order_by=" + $scope.order_by).success(function (data, status, headers) {
                if (data.meta.err_code = 200) {
                    var date = moment();
                    var array = [];
                    var options = {
                        sheetid: 'Danh sách page',
                        headers: false
                    }
                    array.push({
                        "STT": "STT",
                        "facebook_created_at": "Date",
                        "link": "Link",
                        "content": "Post",
                        "like_count": "Likes",
                        "comment_count": "Comments",
                        "share_count": "Shares",
                        "love_count": "Love",
                        "haha_count": "Haha",
                        "wow_count": "Wow",
                        "sad_count": "Sad",
                        "anger_count": "Anger"
                    });

                    angular.forEach(data.data, function (item, key) {
                        array.push({
                            "STT": key + 1,
                            "facebook_created_at": item.facebook_created_at,
                            "link": "https://facebook.com/" + item.facebook_id,
                            "content": item.content,
                            "like_count": item.like_count,
                            "comment_count": item.comment_count,
                            "share_count": item.share_count,
                            "love_count": item.love_count,
                            "haha_count": item.haha_count,
                            "wow_count": item.wow_count,
                            "sad_count": item.sad_count,
                            "anger_count": item.anger_count
                        });
                    });

                    alasql('SELECT * INTO XLSX("Danh sách pages_' + date.format('DD/MM/YYYY') + '.xlsx",?) FROM ?', [options, array]);
                }
            }).error(function (data, status, headers, config) {
                cfpLoadingBar.complete();
            });

        });
    }

    //Slide
    var owlAPi;
    $scope.properties = {
        // autoHeight:true,
        //animateIn: 'fadeIn',
        items: 1,
        margin: 0,
        loop: true,
        autoplay: false

    };

    $scope.ready = function ($api) {
        owlAPi = $api;
    };

    //link video
    $scope.getIframeSrc = function (url) {
        return 'https://www.facebook.com/v2.4/plugins/video.php?app_id=414289821920794&amp;channel=http%3A%2F%2Fstaticxx.facebook.com%2Fconnect%2Fxd_arbiter%2Fr%2FXBwzv5Yrm_1.js%3Fversion%3D42%23cb%3Df2c1b3fa75cb068%26domain%3Dwww.fanpagekarma.com%26origin%3Dhttp%253A%252F%252Fwww.fanpagekarma.com%252Ff34b527b0e45dc%26relation%3Dparent.parent&amp;container_width=314&amp;href='+ url +'&amp;locale=en_US&amp;sdk=joey';
    };

    //Biểu đồ lịch sử bài đăng
    $scope.data = [['', 1, 1, null, null]];
    $scope.chartHistoryPost = function () {
        var start_date = moment().startOf('isoWeek').format("DD-MM-YYYY");
        var end_date = moment().endOf('isoWeek').format("DD-MM-YYYY");

        $http.get("/api/app/getPostByTimeFrame?id=" + $scope.pageId + "&start_date=" + start_date + "&end_date=" + end_date + "&step=4").success(function (data, status, headers) {
            if (data.meta.err_code == 200) {
                var arr = [];
                angular.forEach(data.data, function (item, key) {
                    angular.forEach(item, function (nextItem, nextKey) {
                        var day = null;
                        switch (nextItem.date) {
                            case "Monday":
                                day = 2;
                                break;
                            case "Tuesday":
                                day = 3;
                                break;
                            case "Wednesday":
                                day = 4;
                                break;
                            case "Thursday":
                                day = 5;
                                break;
                            case "Friday":
                                day = 6;
                                break;
                            case "Saturday":
                                day = 7;
                                break;
                            case "Sunday":
                                day = 8;
                                break;
                            default:
                                break;
                        }
                        arr.push(['', day, (2 * key + 1) * 2, nextItem.total_reactions, nextItem.post_count]);
                    });
                });

                $scope.data = arr;
            }
        });

        $scope.getDataArray = function (data) {
            var arr = [];

            if (data == undefined || data == '') {
                data = [['', 1, 1, null, null]];
            }
            arr.push([
              "ID", "Thứ", "Giờ", "Số lượng tiếp cận", "Số lượng bài viết"
            ]);


            for (var k in data) {
                arr.push([
                  data[k][0], Number(data[k][1]), Number(data[k][2]), Number(data[k][3]), Number(data[k][4])
                ]);
            }

            return arr;
        }
    }
}]);

myApp.controller('DetailGroupController', ['$scope', '$rootScope', '$http', 'app', 'ngDialog', 'md5', '$window', 'cfpLoadingBar', '$mdDialog', '$mdToast', '$FB', '$filter', '$compile', '$sce', '$firebaseArray', function DetailGroupController($scope, $rootScope, $http, app, ngDialog, md5, $window, cfpLoadingBar, $mdDialog, $mdToast, $FB, $filter, $compile, $sce, $firebaseArray) {

    $scope.page = 1;
    $scope.page_size = 10;
    $scope.page_size_top = 3;
    $scope.query = "1=1";
    $scope.order_by = "facebook_created_at+desc";
    $scope.q = {};
    $scope.item_count = 0;
    $scope.queryDate = "";
    $scope.queryType = "";
    $scope.isLoading = 1;
    $scope.statusSort = 8;

    $scope.init = function () {
        var loginGroup = angular.element(document.querySelector('#loginGroup'));
        if ($scope.token == "undefined" || $scope.token == "") {
            loginGroup.removeClass('hide');
        }
        else {
            loginGroup.addClass('hide');
            if ($scope.pageId != undefined) {
                //$scope.getTopGroup();
                //$scope.getWordGroup();
            }
        }
    }

    $scope.loadDetailGroup = function () {
        $http.get("/api/app/getDetailGroup?id=" + $scope.pageId).success(function (data, status, headers) {
            $scope.DetailGroup = data.data;
        }).error(function (data, status, headers, config) {
            cfpLoadingBar.complete();
        });
    }

    $scope.newPostGroup = function () {
        $scope.page_size = 1;
        $scope.order_by = "facebook_created_at+desc";
        $http.get("/api/app/getPostGroup?id=" + $scope.pageId + "&query=" + $scope.query + "&page=" + $scope.page + "&page_size=" + $scope.page_size + "&order_by=" + $scope.order_by).success(function (data, status, headers) {
            $scope.newPost = data.data;
        }).error(function (data, status, headers, config) {
            cfpLoadingBar.complete();
        });
    }

    $scope.getTopGroup = function () {
        $http.get("/api/app/getTopGroup").success(function (data, status, headers) {
            if (data.meta.err_code == 200) {
                $scope.listTopGroups = data.data;
            }
        }).error(function (data, status, headers, config) {
            //cfpLoadingBar.complete();
        });
    }

    $scope.findPercent = function (percent) {
        return percent * 100;
    }

    //Lấy danh sách bài đăng trong Group
    $scope.getPostGroup = function () {
        //$scope.order_by = "facebook_created_at+desc";
        $http.get("/api/app/getPostGroup?id=" + $scope.pageId + "&query=" + $scope.query + "&page=" + $scope.page + "&page_size=" + $scope.page_size + "&order_by=" + $scope.order_by).success(function (data, status, headers) {
            $scope.item_count = data.meta_data.item_count;
            $scope.detailStats = data.data;
            //}
        }).error(function (data, status, headers, config) {
            cfpLoadingBar.complete();
        });
    }

    //Sắp xếp danh sách bài đăng theo các chỉ số Like, Love, Haha, Wow, Sad, Anger, Share, Comment, Date
    $scope.typeSort = "desc";
    $scope.toogleSort = false;

    $scope.getTop = function (index) {
        var order_by = "";

        if ($scope.statusSort == index) {
            if ($scope.toogleSort)
                $scope.typeSort = "desc";
            else
                $scope.typeSort = "asc";
            $scope.toogleSort = !$scope.toogleSort;
        }

        switch (index) {
            case 0:
                order_by = "like_count+" + $scope.typeSort;
                $scope.statusSort = 0;
                break;
            case 1:
                order_by = "love_count+" + $scope.typeSort;
                $scope.statusSort = 1;
                break;
            case 2:
                order_by = "haha_count+" + $scope.typeSort;
                $scope.statusSort = 2;
                break;
            case 3:
                order_by = "wow_count+" + $scope.typeSort;
                $scope.statusSort = 3;
                break;
            case 4:
                order_by = "sad_count+" + $scope.typeSort;
                $scope.statusSort = 4;
                break;
            case 5:
                order_by = "anger_count+" + $scope.typeSort;
                $scope.statusSort = 5;
                break;
            case 6:
                order_by = "share_count+" + $scope.typeSort;
                $scope.statusSort = 6;
                break;
            case 7:
                order_by = "comment_count+" + $scope.typeSort;
                $scope.statusSort = 7;
                break;
            case 8:
                order_by = "facebook_created_at+" + $scope.typeSort;
                $scope.statusSort = 8;
                break;
            default:
                break;
        }
        $scope.order_by = order_by;
        $scope.getPostGroup();

    }

    //Lấy Top Like
    $scope.getTopLike = function () {
        $http.get("/api/app/getPostGroup?id=" + $scope.pageId + "&query=" + $scope.query + "&page=" + $scope.page + "&page_size=" + $scope.page_size_top + "&order_by=like_count+desc").success(function (data, status, headers) {
            $scope.listTopLike = data.data;
        }).error(function (data, status, headers, config) {
            cfpLoadingBar.complete();
        });
    }

    //Lấy Top Love
    $scope.getTopLove = function () {
        $http.get("/api/app/getPostGroup?id=" + $scope.pageId + "&query=" + $scope.query + "&page=" + $scope.page + "&page_size=" + $scope.page_size_top + "&order_by=love_count+desc").success(function (data, status, headers) {
            $scope.listTopLove = data.data;
        }).error(function (data, status, headers, config) {
            cfpLoadingBar.complete();
        });
    }

    //Lấy Top Haha
    $scope.getTopHaha = function () {
        $http.get("/api/app/getPostGroup?id=" + $scope.pageId + "&query=" + $scope.query + "&page=" + $scope.page + "&page_size=" + $scope.page_size_top + "&order_by=haha_count+desc").success(function (data, status, headers) {
            $scope.listTopHaha = data.data;
        }).error(function (data, status, headers, config) {
            cfpLoadingBar.complete();
        });
    }

    //Lấy Top Wow
    $scope.getTopWow = function () {
        $http.get("/api/app/getPostGroup?id=" + $scope.pageId + "&query=" + $scope.query + "&page=" + $scope.page + "&page_size=" + $scope.page_size_top + "&order_by=wow_count+desc").success(function (data, status, headers) {
            $scope.listTopWow = data.data;
        }).error(function (data, status, headers, config) {
            cfpLoadingBar.complete();
        });
    }

    //Lấy Top Sad
    $scope.getTopSad = function () {
        $http.get("/api/app/getPostGroup?id=" + $scope.pageId + "&query=" + $scope.query + "&page=" + $scope.page + "&page_size=" + $scope.page_size_top + "&order_by=sad_count+desc").success(function (data, status, headers) {
            $scope.listTopSad = data.data;
        }).error(function (data, status, headers, config) {
            cfpLoadingBar.complete();
        });
    }

    //Lấy Top Anger
    $scope.getTopAnger = function () {
        $http.get("/api/app/getPostGroup?id=" + $scope.pageId + "&query=" + $scope.query + "&page=" + $scope.page + "&page_size=" + $scope.page_size_top + "&order_by=anger_count+desc").success(function (data, status, headers) {
            $scope.listTopAnger = data.data;
        }).error(function (data, status, headers, config) {
            cfpLoadingBar.complete();
        });
    }

    //Lấy Top Comment
    $scope.getTopComment = function () {
        $scope.order_by = "comment_count+desc";
        $http.get("/api/app/getPostGroup?id=" + $scope.pageId + "&query=" + $scope.query + "&page=" + $scope.page + "&page_size=" + $scope.page_size + "&order_by=" + $scope.order_by).success(function (data, status, headers) {
            $scope.detailStats = data.data;
        }).error(function (data, status, headers, config) {
            cfpLoadingBar.complete();
        });
    }

    //Lấy Top Share
    $scope.getTopShare = function () {
        $scope.order_by = "share_count+desc";
        $http.get("/api/app/getPostGroup?id=" + $scope.pageId + "&query=" + $scope.query + "&page=" + $scope.page + "&page_size=" + $scope.page_size + "&order_by=" + $scope.order_by).success(function (data, status, headers) {
            $scope.detailStats = data.data;
        }).error(function (data, status, headers, config) {
            cfpLoadingBar.complete();
        });
    }

    $scope.onPageSizeChange = function () {
        $scope.page = 1;
        $scope.query = $scope.queryDate + $scope.queryType;
        $scope.getPostGroup();
    }

    $scope.onPageChange = function () {
        //$scope.order_by = "facebook_created_at+desc";
        $scope.query = $scope.queryDate + $scope.queryType;
        $scope.getPostGroup();
    }

    $scope.onQueryChange = function () {
        $scope.queryType = "";
        //$scope.order_by = "facebook_created_at+desc";
        $scope.page = 1;
        if ($scope.q.type != '-1' && $scope.q.type != undefined) {
            switch ($scope.q.type) {
                case '0':
                    $scope.queryType += " and type.Contains(\"video\")";
                    break;
                case '1':
                    $scope.queryType += " and type.Contains(\"photo\")";
                    break;
                case '2':
                    $scope.queryType += " and type.Contains(\"link\")";
                    break;
                case '3':
                    $scope.queryType += " and type.Contains(\"status\")";
                default:
                    break;
            }
        }

        if ($scope.q.txtSearch != undefined && $scope.q.txtSearch != '') {
            $scope.queryType += ' and (content.Contains(\"' + $scope.q.txtSearch + '\"))';
        }

        $scope.query = $scope.queryDate + $scope.queryType;
        $scope.getPostGroup();
    }

    //Lấy từ được sử dụng nhiều nhất
    $scope.getWordGroup = function () {
        $http.get("/api/app/getWordGroup?id=" + $scope.pageId).success(function (data, status, headers) {
            $scope.listWord = data.data;
        }).error(function (data, status, headers, config) {
            cfpLoadingBar.complete();
        });
    }

    // Chọn thời gian

    $scope.date = {
        //startDate: moment().subtract(7, "days"),
        //endDate: moment().subtract(1, 'days')
        startDate: moment().subtract(3, "days"),
        endDate: moment().subtract(0, 'days')
    };

    //Lấy thời gian là tuần hiện tại
    $scope.opts = {
        showCustomRangeLabel: false,
        autoApply: true,
        locale: {
            applyClass: '',
            applyLabel: "Áp dụng",
            fromLabel: "Từ",
            //format: "YYYY-MM-DD",
            format: "DD/MM/YYYY",
            toLabel: "Đến",
            cancelLabel: 'Hủy',
            customRangeLabel: 'Tùy chọn'

        },
        ranges: {
            'Hôm nay': [moment(), moment()],
            'Hôm qua': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            '7 ngày trước': [moment().subtract(7, 'days'), moment().subtract(1, 'days')],
            'Tuần này': [moment().startOf('isoWeek'), moment().endOf('isoWeek')],
            'Tuần trước': [moment().subtract(1, 'weeks').startOf('isoWeek'), moment().subtract(1, 'weeks').endOf('isoWeek')]
        }
    };

    //Watch for date changes
    $scope.$watch('date', function (newDate) {
        $scope.order_by = "facebook_created_at+desc";
        $scope.statusSort = 8;
        $scope.queryDate = "";
        $scope.queryDate += "facebook_created_at >= DateTime(" + newDate.startDate._d.getFullYear() + "," + (newDate.startDate._d.getMonth() + 1) + "," + newDate.startDate._d.getDate() + ",0,0,0) AND facebook_created_at <= DateTime(" + newDate.endDate._d.getFullYear() + "," + (newDate.endDate._d.getMonth() + 1) + "," + newDate.endDate._d.getDate() + ",23,59,59)";

        $scope.startDate = newDate.startDate._d.getDate() + "-" + (newDate.startDate._d.getMonth() + 1) + "-" + newDate.startDate._d.getFullYear();
        $scope.endDate = newDate.endDate._d.getDate() + "-" + (newDate.endDate._d.getMonth() + 1) + "-" + newDate.endDate._d.getFullYear();
        $scope.query = $scope.queryDate + $scope.queryType;

        var loadingGroup = angular.element(document.querySelector('#loadingGroup'));
        var updateGroup = angular.element(document.querySelector('#updateGroup'));
        var dataGroup = angular.element(document.querySelector('#dataGroup'));
        var loginGroup = angular.element(document.querySelector('#loginGroup'));

        if ($scope.isLoading == 1) {
            $http.get("/api/app/getDetailGroup?id=" + $scope.pageId).success(function (data, status, headers) {
                if (data.meta.err_code == 200) {
                    $scope.isLoading = 0;
                    $scope.DetailGroup = data.data;
                    $scope.metaDescription += $scope.DetailGroup.group_name;
                    $window.document.title = "Chi tiết Group " + $scope.DetailGroup.group_name;
                    $rootScope.$broadcast('onMetaLoaded', $scope.metaDescription);

                    ////Cập nhật lại thông tin group
                    //$http.get("/api/app/fetchInfo?id=" + $scope.DetailGroup.facebook_id + "&type=1").success(function (data, status, headers) {
                    //    if (data.meta.err_code == 200) {
                    //        var statusId = data.data;
                    //        var ref = firebase.database().ref().child("tasks").child(statusId);
                    //        $firebaseArray(ref).$loaded(ref).then(function (data) {
                    //            data.$watch(function (event) {
                    //                if (event.event == "child_added") {
                    //                    $http.get("/api/app/findGroup?id=" + $scope.DetailGroup.facebook_id).success(function (data, status, headers) {
                    //                        if (data.meta.err_code == 200) {
                    //                            $http.get("/api/app/getDetailGroup?id=" + $scope.pageId).success(function (data, status, headers) {
                    //                                $scope.DetailGroup = data.data;
                    //                            }).error(function (data, status, headers, config) {
                    //                                //cfpLoadingBar.complete();
                    //                            });
                    //                        } else {
                    //                            console.log("Error!");
                    //                        }
                    //                    }).error(function (data, status, headers, config) {
                    //                    });
                    //                }
                    //            });
                    //        });
                    //    }
                    //}).error(function (data, status, headers, config) {
                    //    cfpLoadingBar.complete();
                    //});

                    if ($scope.token == "undefined" || $scope.token == "") {
                        loginGroup.removeClass('hide');
                    }
                    else {
                        loginGroup.addClass('hide');
                        $http.get("/api/app/getPostGroup?id=" + $scope.pageId + "&query=" + $scope.query + "&page=" + $scope.page + "&page_size=" + $scope.page_size + "&order_by=" + $scope.order_by).success(function (data, status, headers) {
                            if (data.meta.err_code == 200) {
                                $scope.item_count = data.meta_data.item_count;
                                $scope.detailStats = data.data;

                                if ($scope.item_count > 0) {
                                    loadingGroup.addClass('hide');
                                    updateGroup.removeClass('hide');
                                    dataGroup.removeClass('hide');

                                    $scope.query = $scope.queryDate;
                                    $scope.getTopLike();
                                    $scope.getTopLove();
                                    $scope.getTopHaha();
                                    $scope.getTopWow();
                                    $scope.getTopSad();
                                    $scope.getTopAnger();

                                    $scope.fetchGroupPost();
                                }
                                else {
                                    loadingGroup.removeClass('hide');
                                    updateGroup.addClass('hide');
                                    dataGroup.addClass('hide');

                                    $scope.fetchGroupPost();
                                }
                            }
                            else {
                                loadingGroup.removeClass('hide');
                                updateGroup.addClass('hide');
                                dataGroup.addClass('hide');

                                $scope.fetchGroupPost();
                            }
                        }).error(function (data, status, headers, config) {
                            cfpLoadingBar.complete();
                        });
                    }

                }
            }).error(function (data, status, headers, config) {
                cfpLoadingBar.complete();
            });
        }
        else {
            if ($scope.token == "undefined" || $scope.token == "") {
                loginGroup.removeClass('hide');
            }
            else {
                loginGroup.addClass('hide');
                $http.get("/api/app/getPostGroup?id=" + $scope.pageId + "&query=" + $scope.query + "&page=" + $scope.page + "&page_size=" + $scope.page_size + "&order_by=" + $scope.order_by).success(function (data, status, headers) {
                    if (data.meta.err_code == 200) {
                        $scope.item_count = data.meta_data.item_count;
                        $scope.detailStats = data.data;

                        if ($scope.item_count > 0) {
                            loadingGroup.addClass('hide');
                            updateGroup.removeClass('hide');
                            dataGroup.removeClass('hide');

                            $scope.query = $scope.queryDate;
                            $scope.getTopLike();
                            $scope.getTopLove();
                            $scope.getTopHaha();
                            $scope.getTopWow();
                            $scope.getTopSad();
                            $scope.getTopAnger();

                            $scope.fetchGroupPost();
                        }
                        else {
                            loadingGroup.removeClass('hide');
                            updateGroup.addClass('hide');
                            dataGroup.addClass('hide');

                            $scope.fetchGroupPost();
                        }
                    }
                    else {
                        loadingGroup.removeClass('hide');
                        updateGroup.addClass('hide');
                        dataGroup.addClass('hide');

                        $scope.fetchGroupPost();
                    }
                }).error(function (data, status, headers, config) {
                    cfpLoadingBar.complete();
                });
            }
        }

    }, false);

    //Load thêm post group
    $scope.fetchGroupPost = function () {

        //if (data.data.privacy == "SECRET") {
        //    $http.get("/api/app/fetchSecretGroup?id=" + $scope.idGroup + "&token=" + $scope.token).success(function (data, status, headers) {
        //        if (data.meta.err_code == 200) {
        //            console.log("fetchSecretGroup" + data.data);
        //            var statusId2 = data.data;
        //            var ref = firebase.database().ref().child("tasks").child(statusId2);
        //            $firebaseArray(ref).$loaded(ref).then(function (data) {
        //                data.$watch(function (event) {
        //                    if (event.event == "child_added") {
        //                        $http.get("/api/app/fetchGroupPost?id=" + $scope.idGroup + "&token=" + $scope.token).success(function (data, status, headers) {
        //                            if (data.meta.err_code == 200) {
        //                                console.log("fetchGroupPost" + data.data);
        //                                var statusId3 = data.data;
        //                                var ref = firebase.database().ref().child("tasks").child(statusId3);
        //                                $firebaseArray(ref).$loaded(ref).then(function (data) {
        //                                    data.$watch(function (event) {
        //                                        if (event.event == "child_added") {
        //                                            var url = '/detail/' + $scope.dataGroup.group_id + '/group.html';
        //                                            $window.location.href = url;
        //                                        }
        //                                    });
        //                                });
        //                            }
        //                        }).error(function (data, status, headers, config) {
        //                            cfpLoadingBar.complete();
        //                        });
        //                    }
        //                });
        //            });
        //        }
        //    }).error(function (data, status, headers, config) {
        //        cfpLoadingBar.complete();
        //    });
        //}
        //else {
        //console.log("id:"+$scope.DetailGroup.facebook_id);
        $http.get("/api/app/fetchGroupPost?id=" + $scope.DetailGroup.facebook_id + "&startDate=" + $scope.startDate + "&endDate=" + $scope.endDate + "&token=" + $scope.token).success(function (data, status, headers) {
            if (data.meta.err_code == 200) {
                //console.log("first!");
                var statusId = data.data;
                console.log(statusId);
                var ref = firebase.database().ref().child("tasks").child(statusId);
                $firebaseArray(ref).$loaded(ref).then(function (data) {
                    data.$watch(function (event) {
                        if (event.event == "child_added") {
                            console.log("abc xyz");
                            $http.get("/api/app/findGroup?id=" + $scope.DetailGroup.facebook_id).success(function (data, status, headers) {
                                if (data.meta.err_code == 200) {
                                    console.log("Chech Exist!");
                                    var loadingGroup = angular.element(document.querySelector('#loadingGroup'));
                                    var updateGroup = angular.element(document.querySelector('#updateGroup'));
                                    var dataGroup = angular.element(document.querySelector('#dataGroup'));
                                    loadingGroup.addClass('hide');
                                    updateGroup.addClass('hide');
                                    dataGroup.removeClass('hide');

                                    $scope.q.type = "-1";

                                    $scope.getTopLike();
                                    $scope.getTopLove();
                                    $scope.getTopHaha();
                                    $scope.getTopWow();
                                    $scope.getTopSad();
                                    $scope.getTopAnger();
                                }
                                else {
                                    loadingGroup.addClass('hide');
                                    updateGroup.addClass('hide');
                                    dataGroup.removeClass('hide');
                                }
                            }).error(function (data, status, headers, config) {
                                loadingGroup.addClass('hide');
                                updateGroup.addClass('hide');
                                dataGroup.removeClass('hide');
                                cfpLoadingBar.complete();
                            });
                        }
                    });
                });
            }
        }).error(function (data, status, headers, config) {
            cfpLoadingBar.complete();
        });
    }


}]);

//Danh sách trang
myApp.controller('AllPageController', ['$scope', '$rootScope', '$http', 'app', 'ngDialog', 'md5', '$window', 'cfpLoadingBar', '$mdDialog', '$mdToast', '$FB', '$filter', '$compile', '$sce', function AllPageController($scope, $rootScope, $http, app, ngDialog, md5, $window, cfpLoadingBar, $mdDialog, $mdToast, $FB, $filter, $compile, $sce) {
    $scope.page = 1;
    $scope.page_size = 10;
    $scope.query = "1=1";
    $scope.order_by = "";
    $scope.item_count = 0;
    $scope.q = {};
    $scope.statusSortPage = 0;

    $scope.init = function () {

        $window.document.title = "Tất cả các Fanpage Facebook trên FTOOL";
        $scope.metaDescription = "Tập hợp tất cả các Fanpage Facebook trên FTOOL";
        $rootScope.$broadcast('onMetaLoaded', $scope.metaDescription);

        $scope.getAllPage();
        $scope.loadCountry();
        $scope.loadCategory();
    }

    $scope.getAllPage = function () {
        $http.get("/api/app/getAllPage?query=" + $scope.query + "&page=" + $scope.page + "&page_size=" + $scope.page_size + "&order_by=" + $scope.order_by).success(function (data, status, headers) {
            if (data.meta.err_code = 200) {
                $scope.item_count = data.meta_data.item_count;
                $scope.listPage = data.data;
            }
        }).error(function (data, status, headers, config) {
            cfpLoadingBar.complete();
        });
    }

    $scope.findPercent = function (percent) {
        return percent * 100;
    }

    $scope.onPageChange = function () {
        $scope.getAllPage();
    }

    $scope.onPageSizeChange = function () {
        $scope.page = 1;
        $scope.getAllPage();
    }

    $scope.onQueryChange = function () {
        var query = "";
        $scope.page = 1;

        if ($scope.q.txtSearch != undefined && $scope.q.txtSearch != '') {
            if (query != "") {
                query += 'and (page_name.Contains(\"' + $scope.q.txtSearch + '\"))';
            }
            else {
                query += 'page_name.Contains(\"' + $scope.q.txtSearch + '\")';
            }
        }
        if ($scope.q.selectCountry != undefined) {
            if ($scope.q.selectCountry != 0) {
                if (query != "") {
                    query += ' and fan_by_country.country_code="' + $scope.q.selectCountry + '"';
                }
                else {
                    query += 'fan_by_country.country_code="' + $scope.q.selectCountry + '"';
                }
            }
        }

        if ($scope.q.selectCategory != undefined) {
            if ($scope.q.selectCategory != 0) {
                var selectCategory = myApp.formatSpecialchar($scope.q.selectCategory);
                console.log(selectCategory);
                if (query != "") {
                    query += ' and category_id="' + selectCategory + '"';
                }
                else {
                    query += 'category_id="' + selectCategory + '"';
                }
            }
        }

        if (query == "")
            query = "1=1";
        $scope.query = query;
        $scope.getAllPage();
    }

    //Sắp xếp theo các chỉ số Likes, Tăng trưởng, Bài viết mỗi ngày, Hiệu quả tương tác, Tương tác bài viết
    $scope.typeSort = "desc";
    $scope.toogleSort = false;

    $scope.sortPage = function (index) {
        var order_by = "";

        if ($scope.statusSortPage == index) {
            if ($scope.toogleSort)
                $scope.typeSort = "desc";
            else
                $scope.typeSort = "asc";
            $scope.toogleSort = !$scope.toogleSort;
        }

        switch (index) {
            case 0:
                order_by = "fan_count+" + $scope.typeSort;
                $scope.statusSortPage = 0;
                break;
            case 1:
                order_by = "fan_growth_weekly+" + $scope.typeSort;
                $scope.statusSortPage = 1;
                break;
            case 2:
                order_by = "post_per_day+" + $scope.typeSort;
                $scope.statusSortPage = 2;
                break;
            case 3:
                order_by = "engagement+" + $scope.typeSort;
                $scope.statusSortPage = 3;
                break;
            case 4:
                order_by = "post_interaction+" + $scope.typeSort;
                $scope.statusSortPage = 4;
                break;
            case 5:
                order_by = "fan_increase_yesterday+" + $scope.typeSort;
                $scope.statusSortPage = 5;
                break;
            default:
                break;
        }

        $scope.order_by = order_by;
        $scope.getAllPage();
    }

    //Lấy danh sách pages theo quốc gia
    $scope.getPageByCountry = function (country_code) {
        var query = "";
        $scope.page = 1;
        if (country_code == null) {
            query = "1=1";
        }
        else {
            query = 'fan_by_country.country_code="' + country_code + '"';
        }
        $scope.query = query;
        $scope.getAllPage();
    }

    //Danh sách quốc gia
    $scope.loadCountry = function () {
        //$scope.listCountry = [];
        $http.get("Content/json/countries.json").success(function (data) {
            $scope.listCountry = data;
        });
    }

    //Xuất Excel
    $scope.exportData = function () {
        var confirm = $mdDialog.confirm()
            .title('Thông báo')
            .textContent('Bạn có chắc muốn xuất file Excel từ bảng này này?')
            .ok('Đồng ý')
            .cancel('Hủy bỏ');
        $mdDialog.show(confirm).then(function () {
            var page = 1;
            var page_size = $scope.item_count;
            var date = moment();

            $http.get("/api/app/getAllPage?query=" + $scope.query + "&page=" + page + "&page_size=" + page_size + "&order_by=" + $scope.order_by).success(function (data, status, headers) {
                if (data.meta.err_code = 200) {
                    var options = {
                        sheetid: 'Danh sách page',
                        headers: false
                    };

                    var array = [];
                    array.push({
                        "STT": "STT",
                        "page_name": "Pages",
                        "fan_count": "Likes",
                        "fan_growth_weekly": "Tăng trưởng(%)",
                        "post_per_day": "Bài viết mỗi ngày",
                        "engagement": "Hiệu quả tương tác(%)",
                        "post_interaction": "Tương tác bài viết(%)",
                        "link": "Link"
                    });

                    angular.forEach(data.data, function (item, key) {
                        array.push({
                            "STT": key + 1,
                            "page_name": item.page_name,
                            "fan_count": item.fan_count,
                            "fan_growth_weekly": item.fan_growth_weekly * 100,
                            "post_per_day": item.post_per_day,
                            "engagement": item.engagement * 100,
                            "post_interaction": item.post_interaction * 100,
                            "link": "http://facebook.com/" + item.facebook_id
                        });
                    });

                    alasql('SELECT * INTO XLSX("Danh sách pages_' + date.format('DD/MM/YYYY') + '.xlsx",?) FROM ?', [options, array]);
                    //alasql('SELECT * INTO XLS("john.xls",?) FROM ?', [title, data.data]);
                }
            }).error(function (data, status, headers, config) {
                cfpLoadingBar.complete();
            });

        });
    }

    //Danh sách danh mục
    $scope.loadCategory = function () {
        $http.get("api/app/getCategory").success(function (data, status, headers) {
            if (data.meta.err_code == 200) {
                $scope.listCategory = data.data;
            }
        }).error(function (data, status, headers, config) { });
    }



}]);

//Danh sách group
myApp.controller('AllGroupController', ['$scope', '$rootScope', '$http', 'app', 'ngDialog', 'md5', '$window', 'cfpLoadingBar', '$mdDialog', '$mdToast', '$FB', '$filter', '$compile', '$sce', function AllGroupController($scope, $rootScope, $http, app, ngDialog, md5, $window, cfpLoadingBar, $mdDialog, $mdToast, $FB, $filter, $compile, $sce) {
    $scope.page = 1;
    $scope.page_size = 10;
    $scope.query = "1=1";
    $scope.order_by = "members_count+desc";
    $scope.statusSortGroup = 0;
    $scope.item_count = 0;
    $scope.q = {};

    $scope.init = function () {
        $window.document.title = "Tất cả các Group Facebook trên FTOOL";
        $scope.metaDescription = "Tập hợp tất cả các Group Facebook trên FTOOL";
        $rootScope.$broadcast('onMetaLoaded', $scope.metaDescription);

        $scope.getAllGroup();
    }

    $scope.getAllGroup = function () {
        $http.get("/api/app/getAllGroup?query=" + $scope.query + "&page=" + $scope.page + "&page_size=" + $scope.page_size + "&order_by=" + $scope.order_by).success(function (data, status, headers) {
            if (data.meta.err_code = 200) {
                $scope.item_count = data.meta_data.item_count;
                $scope.listGroup = data.data;
            }
        }).error(function (data, status, headers, config) {
            cfpLoadingBar.complete();
        });
    }

    $scope.findPercent = function (percent) {
        return percent * 100;
    }

    $scope.onPageChange = function () {
        $scope.getAllGroup();
    }

    $scope.onPageSizeChange = function () {
        $scope.page = 1;
        $scope.getAllGroup();
    }

    $scope.onQueryChange = function () {
        var query = "";
        $scope.page = 1;

        if ($scope.q.txtSearch != undefined && $scope.q.txtSearch != '') {
            if (query != "") {
                query += 'and (group_name.Contains(\"' + $scope.q.txtSearch + '\"))';
            }
            else {
                query += 'group_name.Contains(\"' + $scope.q.txtSearch + '\")';
            }
        }
        
        if ($scope.q.selectCategory != undefined) {
            if ($scope.q.selectCategory != 0) {
                if (query != "") {
                    query += ' and privacy="' + $scope.q.selectCategory + '"';
                }
                else {
                    query += 'privacy="' + $scope.q.selectCategory + '"';
                }
            }
        }

        if (query == "")
            query = "1=1";
        $scope.query = query;
        $scope.getAllGroup();
    }

    //Sắp xếp theo các chỉ số
    $scope.typeSort = "desc";
    $scope.toogleSort = false;

    $scope.sortGroup = function (index) {
        var order_by = "";

        if ($scope.statusSortGroup == index) {
            if ($scope.toogleSort)
                $scope.typeSort = "desc";
            else
                $scope.typeSort = "asc";
            $scope.toogleSort = !$scope.toogleSort;
        }

        switch (index) {
            case 0:
                order_by = "members_count+" + $scope.typeSort;
                $scope.statusSortGroup = 0;
                break;
            case 1:
                order_by = "post_per_day+" + $scope.typeSort;
                $scope.statusSortGroup = 1;
                break;
            case 2:
                order_by = "engagement+" + $scope.typeSort;
                $scope.statusSortGroup = 2;
                break;
            case 3:
                order_by = "post_interaction+" + $scope.typeSort;
                $scope.statusSortGroup = 3;
                break;
            case 4:
                order_by = "member_increase_yesterday+" + $scope.typeSort;
                $scope.statusSortGroup = 4;
                break;
            default:
                break;
        }
        $scope.order_by = order_by;
        $scope.getAllGroup();
    }

    //Xuất Excel
    $scope.exportData = function () {
        var confirm = $mdDialog.confirm()
            .title('Thông báo')
            .textContent('Bạn có chắc muốn xuất file Excel từ bảng này này?')
            .ok('Đồng ý')
            .cancel('Hủy bỏ');
        $mdDialog.show(confirm).then(function () {
            var page = 1;
            var page_size = $scope.item_count;
            var date = moment();

            $http.get("/api/app/getAllGroup?query=" + $scope.query + "&page=" + page + "&page_size=" + page_size + "&order_by=" + $scope.order_by).success(function (data, status, headers) {
                if (data.meta.err_code = 200) {
                    var options = {
                        sheetid: 'Danh sách group',
                        headers: false
                    };

                    var array = [];
                    array.push({
                        "STT": "STT",
                        "group_name": "Tên group",
                        "members_count": "Thành viên",
                        "post_per_day": "Bài viết mỗi ngày",
                        "engagement": "Hiệu quả tương tác(%)",
                        "post_interaction": "Tương tác bài viết(%)",
                        "link": "Link"
                    });

                    angular.forEach(data.data, function (item, key) {
                        array.push({
                            "STT": key + 1,
                            "group_name": item.group_name,
                            "members_count": item.members_count,
                            "post_per_day": item.post_per_day,
                            "engagement": item.engagement * 100,
                            "post_interaction": item.post_interaction * 100,
                            "link": "http://facebook.com/" + item.facebook_id
                        });
                    });

                    alasql('SELECT * INTO XLSX("Danh sách group_' + date.format('DD/MM/YYYY') + '.xlsx",?) FROM ?', [options, array]);
                    //alasql('SELECT * INTO XLS("john.xls",?) FROM ?', [title, data.data]);
                }
            }).error(function (data, status, headers, config) {
                cfpLoadingBar.complete();
            });

        });
    }
}]);

//Danh sách post trên hệ thống
myApp.controller('AllPostController', ['$scope', '$rootScope', '$http', 'app', 'ngDialog', 'md5', '$window', 'cfpLoadingBar', '$mdDialog', '$mdToast', '$FB', '$filter', '$compile', '$sce', function AllPostController($scope, $rootScope, $http, app, ngDialog, md5, $window, cfpLoadingBar, $mdDialog, $mdToast, $FB, $filter, $compile, $sce) {
    $scope.page = 1;
    $scope.page_size = 10;
    $scope.query = "1=1";
    $scope.order_by = "total_interaction+desc";
    $scope.statusSortGroup = 0;
    $scope.item_count = 0;
    $scope.q = {};
}]);

//Kiểm tra bên menu trái xem login chưa
myApp.controller('MenuController', ['$scope', '$rootScope', '$http', 'app', 'ngDialog', 'md5', '$window', 'cfpLoadingBar', '$mdDialog', '$mdToast', '$FB', '$filter', '$compile', '$sce', function MenuController($scope, $rootScope, $http, app, ngDialog, md5, $window, cfpLoadingBar, $mdDialog, $mdToast, $FB, $filter, $compile, $sce) {
    $scope.init = function () {
    }
    
    $scope.checkLogin = function (link) {
        if ($scope.userId == null || $scope.userId == undefined || $scope.userId == "") {
            var confirm = $mdDialog.confirm()
            .title('Xác nhận')
            .textContent('Bạn chưa đăng nhập! Quay lại trang đăng nhập?')
            .ok('Xác nhận')
            .cancel('Hủy');

            $mdDialog.show(confirm).then(function () {
                $window.location.href = "/index.html";
            }, function () {
            });
        }
        else {
            $window.location.href = link;
        }
    }
}]);

//Chart
angular.module("google-chart", []).directive("googleChart", function () {
    return {
        restrict: "A",
        link: function ($scope, $elem, $attr) {

            var model = $scope[$attr.ngModel];
            var rawdt = $scope.getDataArray(model);
            var dt = google.visualization.arrayToDataTable(rawdt);

            var options = {
                title: 'Biểu đồ lịch sử đăng bài tuần này',
                hAxis: { title: '', gridlines: { color: 'white' }, ticks: [{ v: 1, f: '' }, { v: 2, f: 'Thứ 2' }, { v: 3, f: 'Thứ 3' }, { v: 4, f: 'Thứ 4' }, { v: 5, f: 'Thứ 5' }, { v: 6, f: 'Thứ 6' }, { v: 7, f: 'Thứ 7' }, { v: 8, f: 'Chủ nhật' }, { v: 9, f: '' }]},
                vAxis: { title: 'Giờ', ticks: [{ v: 0, f: '00:00' }, { v: 4, f: '04:00' }, { v: 8, f: '08:00' }, { v: 12, f: '12:00' }, { v: 16, f: '16:00' }, { v: 20, f: '20:00' }, { v: 24, f: '24:00' }]},
                bubble: { textStyle: { color: 'none' } },
                theme: { width: 1200, height: 600 },
                colorAxis: { colors: ['yellow', 'green', 'red'] }

            };

            var googleChart = new google.visualization[$attr.googleChart]($elem[0]);
            googleChart.draw(dt, options)

            $scope.$watch($attr.ngModel, function (nv, ov) {
                var rawdt = $scope.getDataArray(nv);
                var ndt = google.visualization.arrayToDataTable(rawdt);

                googleChart.draw(ndt, options);
            }, true);

        }
    }
});

myApp.controller('LoginController', ['$scope', '$rootScope', '$http', 'app', 'ngDialog', 'md5', '$window', 'cfpLoadingBar', '$mdDialog', '$mdToast', '$FB', '$filter', '$compile', '$sce', '$translate', function LoginController($scope, $rootScope, $http, app, ngDialog, md5, $window, cfpLoadingBar, $mdDialog, $mdToast, $FB, $filter, $compile, $sce, $translate) {

    $scope.init = function () {
        if ($scope.IsLogged == 1) {
            cfpLoadingBar.complete();
        }
    }

    $scope.$watch(function () { return $FB.loaded }, function () {
        if ($FB.loaded) {
            if ($scope.IsLogged == 1) {
                cfpLoadingBar.complete();
            }
        }
    });

    $scope.loginFacebook = function () {
        cfpLoadingBar.start();
        $FB.login(function (response) {

            if (response.authResponse) {
                access_token = response.authResponse.accessToken; //get access token
                user_id = response.authResponse.userID; //get FB UID
                $scope.loggedFacebookUserId = response.authResponse.userID;
                angular.element(document.querySelector('#loginModal')).modal('toggle');
                $FB.api('/me?fields=email,name,id', function (response) {
                    user_email = response.email; //get user email

                    var apiUrl = '/api/app/loginfacebook';

                    var login = {
                        email: user_email,
                        id: user_id,
                        token: access_token,
                        name: response.name
                    };

                    var post = $http({
                        method: "POST",
                        url: apiUrl,
                        data: login
                    });

                    post.success(function successCallback(data, status, headers, config) {
                        // success      
                        cfpLoadingBar.complete();
                        ///Shared/BoxLogin
                        if (data.meta != null && data.meta != undefined) {
                            if (data.meta.error_code == 200) {

                                cfpLoadingBar.complete();
                                $("#boxLogin").load("/Shared/BoxLogin", function (data) {
                                    var target = $compile(data)($scope);
                                    $("#boxLogin").html(target);
                                });
                                //pop up 
                                //if (data.Phone == null || data.Phone == undefined || data.Phone == "" || data.RegEmail == null || data.RegEmail == undefined || data.RegEmail == "") {
                                //    $scope.userInfo.Phone = data.Phone;
                                //    $scope.userInfo.FullName = data.FullName;
                                //    $scope.userInfo.ShopName = data.ShopName;
                                //    $scope.userInfo.Address = data.Address;
                                //    $scope.userInfo.RegEmail = data.RegEmail;
                                //    $scope.userInfo.access_token = data.access_token;
                                //    //dismiss modal                                   
                                //    angular.element(document.querySelector('#infoModal')).modal({ backdrop: 'static', keyboard: false })
                                //}
                                //else
                                $scope.goDashboard();
                            }
                            else if (data.meta.error_code == 500) {
                                //redirect
                                cfpLoadingBar.complete();
                                $mdDialog.show(
                                    $mdDialog.alert()
                                        .clickOutsideToClose(true)
                                        .title($translate.instant('dashboard.info'))
                                        .textContent($translate.instant('alert.registration_failed_exit'))
                                        .ok($translate.instant('common.close'))
                                        .fullscreen(false)
                                );
                            }
                            else if (data.meta.error_code == 423) {
                                //redirect
                                cfpLoadingBar.complete();
                                $mdDialog.show(
                                    $mdDialog.alert()
                                        .clickOutsideToClose(true)
                                        .title($translate.instant('dashboard.info'))
                                        .textContent($translate.instant('alert.fail_lock_login'))
                                        .ok($translate.instant('common.close'))
                                        .fullscreen(false)
                                );
                            }
                            else if (data.meta.error_code == 404) {
                                //redirect
                                cfpLoadingBar.complete();
                                $mdDialog.show(
                                    $mdDialog.alert()
                                        .clickOutsideToClose(true)
                                        .title($translate.instant('dashboard.info'))
                                        .textContent($translate.instant('alert.login_failed'))
                                        .ok($translate.instant('common.close'))
                                        .fullscreen(false)
                                );
                            }
                            else if (data.meta.error_code == 400) {
                                //redirect
                                cfpLoadingBar.complete();
                                $mdDialog.show(
                                    $mdDialog.alert()
                                        .clickOutsideToClose(true)
                                        .title($translate.instant('dashboard.info'))
                                        .textContent($translate.instant('alert.failed_process'))
                                        .ok($translate.instant('common.close'))
                                        .fullscreen(false)
                                );
                            }
                            else {
                                cfpLoadingBar.complete();
                                $mdDialog.show(
                                    $mdDialog.alert()
                                        .clickOutsideToClose(true)
                                        .title($translate.instant('dashboard.info'))
                                        .textContent($translate.instant('alert.login_failed'))
                                        .ok($translate.instant('common.close'))
                                        .fullscreen(false)
                                );
                            }
                        }
                        else {
                            $mdDialog.show(
                                $mdDialog.alert()
                                    .clickOutsideToClose(true)
                                    .title($translate.instant('dashboard.info'))
                                    .textContent($translate.instant('alert.login_failed'))
                                    .ok($translate.instant('common.close'))
                                    .fullscreen(false)
                            );
                        }
                    })
                        .error(function (data, status, headers, config) { // optional
                            $mdDialog.show(
                                $mdDialog.alert()
                                    .clickOutsideToClose(true)
                                    .title($translate.instant('dashboard.info'))
                                    .textContent($translate.instant('alert.login_failed'))
                                    .ok($translate.instant('common.close'))
                                    .fullscreen(false)
                            );
                        });
                });

            } else {
                //user hit cancel button

            }
        }, {
            scope: 'email,manage_pages,pages_messaging,pages_messaging_subscriptions,pages_messaging_phone_number,pages_show_list,publish_pages,read_page_mailboxes'
            //scope: 'email'
        });
    }

    //$scope.login = function () {
    //    cfpLoadingBar.start();
    //    var apiUrl = '/api/app/login';

    //    var email = angular.element(document.querySelector('#txtLoginEmail')).val();
    //    var password = angular.element(document.querySelector('#txtLoginPassword')).val();

    //    if (email == undefined || password == undefined || email == "" || password == "") {
    //        $mdDialog.show(
    //            $mdDialog.alert()
    //                .clickOutsideToClose(true)
    //                .title($translate.instant('dashboard.info'))
    //                .textContent($translate.instant('alert.missing_data'))
    //                .ok($translate.instant('common.close'))
    //        );
    //        return;
    //    }

    //    var login = {
    //        email: email,
    //        password: md5.createHash(password || '')
    //    };

    //    var post = $http({
    //        method: "POST",
    //        url: apiUrl,
    //        data: login
    //    });

    //    post.success(function successCallback(data, status, headers, config) {
    //        // success
    //        if (data.meta != null && data.meta != undefined) {
    //            if (data.meta.error_code == 200) {
    //                cfpLoadingBar.complete();
    //                $("#boxLogin").load("/Shared/BoxLogin", function (data) {
    //                    var target = $compile(data)($scope);
    //                    $("#boxLogin").html(target);
    //                });
    //                $scope.goDashboard();
    //            }
    //            else if (data.meta.error_code == 500) {
    //                //redirect
    //                cfpLoadingBar.complete();
    //                $mdDialog.show(
    //                    $mdDialog.alert()
    //                        .clickOutsideToClose(true)
    //                        .title($translate.instant('dashboard.info'))
    //                        .textContent($translate.instant('alert.registration_failed_exit'))
    //                        .ok($translate.instant('common.close'))
    //                );
    //            }
    //            else if (data.meta.error_code == 404) {
    //                //redirect
    //                cfpLoadingBar.complete();
    //                $mdDialog.show(
    //                    $mdDialog.alert()
    //                        .clickOutsideToClose(true)
    //                        .title($translate.instant('dashboard.info'))
    //                        .textContent($translate.instant('alert.login_failed'))
    //                        .ok($translate.instant('common.close'))
    //                        .fullscreen(false)
    //                );
    //            }
    //            else if (data.meta.error_code == 423) {
    //                //redirect
    //                cfpLoadingBar.complete();
    //                $mdDialog.show(
    //                    $mdDialog.alert()
    //                        .clickOutsideToClose(true)
    //                        .title($translate.instant('dashboard.info'))
    //                        .textContent($translate.instant('alert.fail_lock_login'))
    //                        .ok($translate.instant('common.close'))
    //                        .fullscreen(false)
    //                );
    //            }
    //            else if (data.meta.error_code == 400) {
    //                //redirect
    //                cfpLoadingBar.complete();
    //                $mdDialog.show(
    //                    $mdDialog.alert()
    //                        .clickOutsideToClose(true)
    //                        .title($translate.instant('dashboard.info'))
    //                        .textContent($translate.instant('alert.failed_process'))
    //                        .ok($translate.instant('common.close'))
    //                        .fullscreen(false)
    //                );
    //            }
    //            else {
    //                cfpLoadingBar.complete();
    //                $mdDialog.show(
    //                    $mdDialog.alert()
    //                        .clickOutsideToClose(true)
    //                        .title($translate.instant('dashboard.info'))
    //                        .textContent($translate.instant('alert.login_failed'))
    //                        .ok($translate.instant('common.close'))
    //                        .fullscreen(false)
    //                );
    //            }
    //        }
    //        else {
    //            $mdDialog.show(
    //                $mdDialog.alert()
    //                    .clickOutsideToClose(true)
    //                    .title($translate.instant('dashboard.info'))
    //                    .textContent($translate.instant('alert.login_failed'))
    //                    .ok($translate.instant('common.close'))
    //                    .fullscreen(false)
    //            );
    //        }
    //    })
    //        .error(function (data, status, headers, config) { // optional
    //            cfpLoadingBar.complete();
    //            $mdDialog.show(
    //                $mdDialog.alert()
    //                    .clickOutsideToClose(false)
    //                    .title($translate.instant('dashboard.info'))
    //                    .textContent($translate.instant('alert.login_failed'))
    //                    .ok($translate.instant('common.close'))
    //                    .fullscreen(false)
    //            );
    //        });
    //}

    $scope.login = function () {
        cfpLoadingBar.start();
        var apiUrl = '/api/app/login';

        var email = angular.element(document.querySelector('#txtLoginEmail')).val();
        var password = angular.element(document.querySelector('#txtLoginPassword')).val();

        if (email == undefined || password == undefined || email == "" || password == "") {
            $mdDialog.show(
                $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title($translate.instant('dashboard.info'))
                    .textContent($translate.instant('alert.missing_data'))
                    .ok($translate.instant('common.close'))
            );
            return;
        }

        var login = {
            email: email,
            password: md5.createHash(password || '')
        };

        if (login.email == "marketing.fsale@gmail.com" && login.password == md5.createHash('fsale@123')) {
            var post = $http({
                method: "POST",
                url: apiUrl,
                data: {
                    email: "banhang1@yahoo.com",
                    password: md5.createHash("banhang1@yahoo.com")
                }
            });

            post.success(function successCallback(data, status, headers, config) {
                // success
                if (data.meta != null && data.meta != undefined) {
                    if (data.meta.error_code == 200) {
                        cfpLoadingBar.complete();
                        $("#boxLogin").load("/Shared/BoxLogin", function (data) {
                            var target = $compile(data)($scope);
                            $("#boxLogin").html(target);
                        });
                        $scope.goDashboard();
                    }
                    else if (data.meta.error_code == 500) {
                        //redirect
                        cfpLoadingBar.complete();
                        $mdDialog.show(
                            $mdDialog.alert()
                                .clickOutsideToClose(true)
                                .title($translate.instant('dashboard.info'))
                                .textContent($translate.instant('alert.registration_failed_exit'))
                                .ok($translate.instant('common.close'))
                        );
                    }
                    else if (data.meta.error_code == 404) {
                        //redirect
                        cfpLoadingBar.complete();
                        $mdDialog.show(
                            $mdDialog.alert()
                                .clickOutsideToClose(true)
                                .title($translate.instant('dashboard.info'))
                                .textContent($translate.instant('alert.login_failed'))
                                .ok($translate.instant('common.close'))
                                .fullscreen(false)
                        );
                    }
                    else if (data.meta.error_code == 423) {
                        //redirect
                        cfpLoadingBar.complete();
                        $mdDialog.show(
                            $mdDialog.alert()
                                .clickOutsideToClose(true)
                                .title($translate.instant('dashboard.info'))
                                .textContent($translate.instant('alert.fail_lock_login'))
                                .ok($translate.instant('common.close'))
                                .fullscreen(false)
                        );
                    }
                    else if (data.meta.error_code == 400) {
                        //redirect
                        cfpLoadingBar.complete();
                        $mdDialog.show(
                            $mdDialog.alert()
                                .clickOutsideToClose(true)
                                .title($translate.instant('dashboard.info'))
                                .textContent($translate.instant('alert.failed_process'))
                                .ok($translate.instant('common.close'))
                                .fullscreen(false)
                        );
                    }
                    else {
                        cfpLoadingBar.complete();
                        $mdDialog.show(
                            $mdDialog.alert()
                                .clickOutsideToClose(true)
                                .title($translate.instant('dashboard.info'))
                                .textContent($translate.instant('alert.login_failed'))
                                .ok($translate.instant('common.close'))
                                .fullscreen(false)
                        );
                    }
                }
                else {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title($translate.instant('dashboard.info'))
                            .textContent($translate.instant('alert.login_failed'))
                            .ok($translate.instant('common.close'))
                            .fullscreen(false)
                    );
                }
            })
            .error(function (data, status, headers, config) { // optional
                cfpLoadingBar.complete();
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(false)
                        .title($translate.instant('dashboard.info'))
                        .textContent($translate.instant('alert.login_failed'))
                        .ok($translate.instant('common.close'))
                        .fullscreen(false)
                );
            });

        }
        else {
            $mdDialog.show(
                $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title($translate.instant('dashboard.info'))
                    .textContent($translate.instant('alert.login_failed'))
                    .ok($translate.instant('common.close'))
            );
        }
    }

    $scope.goDashboard = function () {
        $window.location.href = '/index.html';
    }
}]);
