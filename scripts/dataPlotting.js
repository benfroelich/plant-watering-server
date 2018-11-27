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
    const min = document.getElementById('minDate').value,
          max = document.getElementById('maxDate').value;
    console.log("updating limits: " + min + " - " + max);
    $.get('/refreshData', {min: min, max: max}, function(newData) {
        updatePlots(newData);
    });
}

$('#scale').click(function() {
   // todo 
});

// use AJAX route to update plot data
$('#refresh').click(function() {
    getAndPlotData();
});

// get data when page is loaded
$(window).on('load', function() {
    getAndPlotData();
});
