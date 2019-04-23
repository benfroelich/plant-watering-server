$(document).ready(function() {
    $("input").popup();
});

function threshEn()
{
    console.log("clicked"); 
    $("input.thresh_en").each(function(i) {
        target = ".hideable_moisture_"+i;
        $(this).is(':checked') ? $(target).show() : $(target).hide();
    });
}

threshEn();

$("input.thresh_en").on("click", threshEn);

