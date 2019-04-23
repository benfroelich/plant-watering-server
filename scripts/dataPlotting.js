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
    $("canvas").remove();
    
    data.datasets.forEach(function(sensor, i) {
        // add DOM element
        let canvas = document.createElement("canvas");
        canvas.setAttribute('id', "chart-" + i);
        $("#plots").append(canvas);
        
        // add data
        var context = canvas.getContext('2d');
        var config = {
            type: 'line',
            data: {
                datasets: [{
                    data: sensor.data,
                    label: sensor.label,
                    lineTension: 0,
                    fill: false
                }]
            },
            options: {
                animation: false,
                scales: {
                    xAxes: [{
                        type: 'time',
                    }],
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: sensor.yAxis
                        }
                    }]
                }
            }
        }
        var scatterchart = new Chart(context, config);
    });
}

function getAndPlotData() {
    let min = new Date(document.getElementById('minDate').value),
        max = new Date(document.getElementById('maxDate').value);

    updateStatusIndicator('loading data', true);

    // display the past month worth of data if nothing entered
    if(!(max instanceof Date && !isNaN(max))) {
        max = new Date();
        document.getElementById('maxDate').value = moment(max).format("YYYY-MM-DD"); 
    }
    if(!(min instanceof Date && !isNaN(min))) {
        min = new Date();
        min.setMonth(max.getMonth() - 1);
        document.getElementById('minDate').value = moment(min).format("YYYY-MM-DD");
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
