/**
 * Created by Phantom on 12/30/2016.
 */
 window.onload = function(){

        //Check File API support
        if(window.File && window.FileList && window.FileReader)
        {
            var filesInput = document.getElementById("files");

            filesInput.addEventListener("change", function(event){

                var files = event.target.files; //FileList object
                var output = document.getElementById("result");

                for(var i = 0; i< files.length; i++)
                {
                    var file = files[i];
                    var index = 1;

                    //Only pics
                    if(!file.type.match('image'))
                        continue;

                    var picReader = new FileReader();

                    picReader.addEventListener("load",function(event){

                        var picFile = event.target;

                        var div = document.createElement("div");

                        div.innerHTML = "<images onclick='showEditor("+index+");' class='thumbnail' src='" + picFile.result + "'" +
                        "title='" + picFile.name + "'/>";

                        output.insertBefore(div,null);
                        index++;

                    });

                    //Read the image
                    picReader.readAsDataURL(file);
                }

            });
        }
        else
        {
            console.log("Your browser does not support File API");
        }
    }

    //function showEditor(index){
    //    if(index == 1){
    //        $('form').slideToggle(function () {
    //            $(this).toggleClass('in out');
    //        });
    //    }else if(index ==2)
    //    {
    //        $('form').slideToggle(function () {
    //            $(this).toggleClass('in out');
    //        });
    //    }else if(index ==3)
    //    {
    //        $('form').slideToggle(function () {
    //            $(this).toggleClass('in out');
    //        });
    //    }else if(index ==4)
    //    {
    //        $('form').slideToggle(function () {
    //            $(this).toggleClass('in out');
    //        });
    //    }else if(index ==5)
    //    {
    //        $('form').slideToggle(function () {
    //            $(this).toggleClass('in out');
    //        });
    //    }
    //}

    $(document).ready(function() {
        $('.list-ul-items').click(function() {
            $(this).children('ul').slideToggle(function () {
                $(this).toggleClass('in out');
            });

            //remove class in and add class out
            $(this).siblings().find('ul').slideUp(function () {
                $(this).children('ul').slideToggle(function () {
                    $(this).toggleClass('in out');
                });
            });
        });
    });

    