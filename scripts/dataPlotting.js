function updateStatusIndicator(message, loading)
{
    console.log(`${message} : ${loading}`);
    $("#status-message").removeClass("hidden").addClass("visible");
    $("#status-message-text").html(message);
    if(loading) 
        $("#status-message-loading").show(); 
    else 
        $("#status-message-loading").hide(); 
}

function hideStatusIndicator()
{
    $("#status-message").removeClass("visible").addClass("hidden");
}

function updatePlots(newData) {
    console.log('New Data:');
    console.log(newData);
    
    // send message if no data was found or there was an error
    if(newData.hasOwnProperty("status")) {
        if(status == "failed") {
            updateStatusIndicator("error getting data, please "
                + "contact Benny. " + newData.reason);
        }
    } else if(newData.hasOwnProperty("datasets"))
    {
        if(newData.datasets.length == 0) {
            console.log("empty dataset");
            updateStatusIndicator("no data found, try different dates?", false);
        } else {
            hideStatusIndicator();
            createPlots(newData);
        }
    }
}

function createPlots(data) {
    // wipe out existing plots 
    $(".chart").remove();
    $(".chartTitle").remove();
    // TODO? reset synchronizer

    let charts = [];
    data.datasets.forEach(function(sensor, i) {
        // add DOM element
        let div = document.createElement("div");
        let title = document.createElement("h2");
        
        title.innerHTML = sensor.label;
        title.className += " chartTitle";

        div.setAttribute('id', "div-chart-" + i);
        div.className += " chart";

        $("#plots").append(title);
        $("#plots").append(div);

        let gData = [];
        sensor.data.forEach(function(point, i) {
            gData.push([new Date(point.x), point.y]);
        });
        g = new Dygraph(div, gData, {
            labels: ["time", sensor.yAxis],
        });
        charts.push(g);
    });
    
    // synchronize the charts
    let sync = Dygraph.synchronize(charts);

}

function formatForDateTime(date)
{
    return moment(date).format("YYYY-MM-DDTHH:mm:ss");
}

function getAndPlotData() {
    let min = new Date(document.getElementById('minDate').value),
        max = new Date(document.getElementById('maxDate').value);

    updateStatusIndicator('loading data', true);

    // display the past month worth of data if nothing entered
    if(!(max instanceof Date && !isNaN(max))) {
        max = new Date();
        document.getElementById('maxDate').value = formatForDateTime(max);
    }
    if(!(min instanceof Date && !isNaN(min))) {
        min = new Date();
        min.setMonth(max.getMonth() - 1);
        document.getElementById('minDate').value = formatForDateTime(min);
    }
    console.log("updating limits: " + min + " - " + max);
    $.get('/refreshData', {min: min, max: max}, function(newData) {
        updatePlots(newData);
    });
}

// use AJAX route to update plot data
$('#refresh').click(function() {
    getAndPlotData();
});

// get data when page is loaded
$(window).on('load', function() {
    getAndPlotData();
});
