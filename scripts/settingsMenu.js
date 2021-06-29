$(document).ready(function () {
    $("input").popup();
});

function threshEn() {
    $("input.thresh_en").each(function (i) {
        target = ".hideable_moisture_" + i;
        $(this).is(':checked') ? $(target).show() : $(target).hide();
    });
}

threshEn();

$(".zones").on("click", "input.thresh_en", threshEn);
$(".zones").on("click", "button.add_time", function () {
    times = $(this).siblings(".watering_time");
    if (times.length < 4) {
        times.last().clone().insertAfter(times.last());
        updateTimeIndeces();
    }
});
$(".zones").on("click", "button.remove_time", function () {
    times = $(this).siblings(".watering_time");
    if (times.length > 1) times.last().remove();
});

$("button.remove_zone").on("click", function () {
    $(this).parents(".zone").remove();
    updateZoneIndeces();
});

$("button.add_zone").on("click", function () {
    last_zone = $(".zone").last();
    new_zone = last_zone.clone();
    new_zone.insertAfter(last_zone);
    updateZoneIndeces();
});

function updateZoneIndeces() {
    $(".zone").each(function (index, zone) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = $(this).find("input")[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                elem = _step.value;

                elem.name = elem.name.replace(/^zones\[(\d+)/, "zones[" + index);
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        $(this).find(".hideable_moisture").removeClass(function (i, className) {
            return (className.match(/(^|\s)hideable_moisture_\d+/g) || []).join(" ");
        });
        $(this).find(".hideable_moisture").addClass("hideable_moisture_" + index);
    });
}

function updateTimeIndeces() {
    $(".zone").each(function (index, zone) {
        $(this).find(".watering_time").each(function (inner_index, elem) {
            elem.name = elem.name.replace(/(^zones\[\d+\]\[time_of_day\])\[(\d+)\]/, "$1[" + inner_index + "]");
        });
    });
}