function updatePlots(newData) {
    console.log('New Data:');
    console.log(newData);
    
    
    // wipe out existing plots (ya not efficient I know)
    $("canvas").remove();
    newData.datasets.forEach(function(sensor, i) {
        // add DOM element
        var canvas = document.createElement("canvas");
        canvas.setAttribute('id', "chart-" + i);
        document.body.appendChild(canvas);
        
        // add data
        var context = canvas.getContext('2d');
        var config = {
            type: 'line',
            data: {
                datasets: [{
                    data: sensor.data,
                    label: sensor.label
                }]
            },
            options: {
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
// todo - limit based on date range
function getAndPlotData() {
    var min = new Date(document.getElementById('minDate').value),
        max = new Date(document.getElementById('maxDate').value);
    // display the past month worth of data if nothing entered
    if(!(max instanceof Date && !isNaN(max))) {
        max = new Date();
        document.getElementById('maxDate').value = max.toDateString(); 
    }
    if(!(min instanceof Date && !isNaN(min))) {
        min = new Date();
        min.setMonth(max.getMonth() - 1);
        document.getElementById('minDate').value = min.toDateString();
    }
    console.log("updating limits: " + min + " - " + max);
    $.get('/refreshData', {min: min, max: max}, function(newData) {
        updatePlots(newData);
    });
}

$('#scale').click(function() {
   // todo 
   // determine if more data needed
    // if needed, get and plot data, otherwise zoom
});

// use AJAX route to update plot data
$('#refresh').click(function() {
    getAndPlotData();
});

// get data when page is loaded
$(window).on('load', function() {
    getAndPlotData();
});
