/**
 * Created by Bich on 27/06/2017
 */var options = [];


$(document).ready(function () {
    $("#reportBill tr:odd").addClass("odd");

    $("#reportBill tr:not(.odd)").hide();
    $("#reportBill tr:first-child").show();

    $('#reportBill tr.odd').on('click', function () {

        $('.up').attr('class', 'arrow odd');
        $(this).attr('class', 'arrow odd up');
        $('.t-content').hide();
        $(this).next("tr").toggle();
    });
    //$("#reportBill").jExpand();
});


//=======
$(document).ready(function () {
    $("#report1 tr:odd").addClass("odd");

    $("#report1 tr:not(.odd)").hide();
    $("#report1 tr:first-child").show();

    $('#report1 tr.odd').on('click', function () {

        $('.up').attr('class', 'arrow odd');
        $(this).attr('class', 'arrow odd up');
        $('.t-content').hide();
        $(this).next("tr").toggle();
    });
    //$("#report").jExpand();
});

//=======
$(document).ready(function () {
    $("#report2 tr:odd").addClass("odd");

    $("#report2 tr:not(.odd)").hide();
    $("#report2 tr:first-child").show();

    $('#report2 tr.odd').on('click', function () {

        $('.up').attr('class', 'arrow odd');
        $(this).attr('class', 'arrow odd up');
        $('.t-content').hide();
        $(this).next("tr").toggle();
    });
    //$("#report").jExpand();
});


$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
});
