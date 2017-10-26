/**
 * Created by Bich on 12/19/2016.
 */var options = [];

// $('.dropdown-menu a').on('click', function (event) {

//     var $target = $(event.currentTarget),
//         val = $target.attr('data-value'),
//         $inp = $target.find('input'),
//         idx;

//     if (( idx = options.indexOf(val) ) > -1) {
//         options.splice(idx, 1);
//         setTimeout(function () {
//             $inp.prop('checked', false)
//         }, 0);
//     } else {
//         options.push(val);
//         setTimeout(function () {
//             $inp.prop('checked', true)
//         }, 0);
//     }

//     $(event.target).blur();

//     console.log(options);
//     return false;
// });
//=======
$(document).ready(function () {
    $("#report tr:odd").addClass("odd");

    $("#report tr:not(.odd)").hide();
    $("#report tr:first-child").show();

    $('#report tr.odd').on('click', function () {

        $('.up').attr('class', 'arrow odd');
        $(this).attr('class', 'arrow odd up');
        $('.t-content').hide();
        $(this).next("tr").toggle();
    });
    //$("#report").jExpand();
});


//=======
var picMainDomEle = $(document.getElementById("detail_product_picture_main"));
var picThumbDomEle = $(document.getElementById("detail_product_picture_thumbnail"));
var picThumbCurrentPage = 1;
var picThumbMaxPage = 2;
var picThumbMargin = 48;
function slidePictureThumbnail(type, domEle) {
    if (type == "left") {
        if (picThumbCurrentPage == 1) return;
        picThumbCurrentPage--;
        picThumbDomEle.find("li").animate({marginLeft: "+=" + picThumbMargin}, 50);
    }
    else if (type == "right") {
        if (picThumbCurrentPage == picThumbMaxPage) return;
        picThumbCurrentPage++;
        picThumbDomEle.find("li").animate({marginLeft: "-=" + picThumbMargin}, 50);
    }
    domEle.blur();
}

var arrPicLoaded = Array();
arrPicLoaded[0] = 1;
function changePictureProduct(domEle) {
    var id = domEle.attr("index");
    if (arrPicLoaded[id] != 1) picMainDomEle.find(".loading").removeClass("hidden");
    picThumbDomEle.find("li").removeClass("current");
    domEle.addClass("current");
    mainpath = domEle.find("a").attr("mainPicture");
    zoom = parseInt(domEle.attr("zoom"));
    picHtml = '<images iData="' + id + '" src="' + mainpath + '" onclick="productPictureFancybox(' + id + ')" />';
    picMainDomEle.find('.icon_zoom').attr('onclick', 'productPictureFancybox(' + id + ')');
    if (zoom == 1) picHtml = '<images iData="' + id + '" src="' + mainpath + '" data-zoom-image="' + domEle.find("a").attr("href") + '" />';
    else $(".zoomContainer").remove();
    if (arrPicLoaded[id] != 1) {
        $(picHtml).load(function () {
            arrPicLoaded[id] = 1;
            picMainDomEle.find(".loading").addClass("hidden").end().find("h2").html(picHtml);
            if (zoom == 1) productPictureElevateZoom();
        });
    }
    else {
        picMainDomEle.find("h2").html(picHtml);
        if (zoom == 1) productPictureElevateZoom();
    }
}

picThumbDomEle.find("li").mouseenter(function () {
    if ($(this).is(".current")) return;
    changePictureProduct($(this));
});



/**
 * Created by User on 1/5/2017.
 */

$(document).ready(function () {

    $("i").tooltip();
    $('#company').click(function () {
        if ($(this).is(':checked')) {
            $('#companyNameValue').css("display", "block");
        }
    });

    $('#personal').click(function () {
        if ($(this).is(':checked')) {
            $('#companyNameValue').css("display", "none");
        }
    });

    $('html').click(function () {
        $('.sale-input').hide();
    });

    $('.billPro').click(function (event) {
        event.stopPropagation();
    });

    $('#sale-input-value').click(function (event) {
        $('.sale-input').toggle();
    });

    //change type message in chat content
    $('.item-type').click(function (event) {
        $(this).toggleClass('item-type-pro');
    });


});

window.onload = function () {
    if (window.File && window.FileList && window.FileReader) {
        //show multi images out in input element
        var images = document.getElementById("file-image");
        images.addEventListener("change", function (event) {
            $('.show-out-image').css('border-top','1px solid #cccccc');
            var files = event.target.files; //FileList object
            var output = document.getElementById("result-image");
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var index = 1;
                if (!file.type.match('image'))
                    continue;
                var picReader = new FileReader();
                picReader.addEventListener("load", function (event) {
                    var picFile = event.target;
                    var div = document.createElement("div");
                    div.innerHTML = "<images  class='thumbnail' src='" + picFile.result + "'" +
                        "title='" + picFile.name + "'/>";
                    output.insertBefore(div, null);
                    index++;
                });

                picReader.readAsDataURL(file);
            }
        });

        //show files out in input element
        var files = document.getElementById("files");
        files.addEventListener("change", function (event) {
            $('.show-out-file').css('border-top','1px solid #cccccc');
            var filename = $('#files').val();
            if (filename.substring(3, 11) == 'fakepath') {
                filename = filename.substring(12);
            }
            var output = document.getElementById("result-files");
            var div = document.createElement("div");
            div.innerHTML = "<p class='name-file-show'><i class='fa fa-file-text-o' aria-hidden='true'></i><span> " + filename + "<i/></p>";
            output.insertBefore(div, null);

        });
    }
}

