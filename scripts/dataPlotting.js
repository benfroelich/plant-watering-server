function updatePlot(newData) {
    var scatterValues = [];
    console.log(newData);
    newData.forEach(function(row) {
        scatterValues.push({y: row.measurement, x: (row.time)});
    });
    console.log(scatterValues);
    var ctx = document.getElementById('timePlot').getContext('2d');
    var scatterchart = new Chart(ctx, {
        type: 'line', 
        data: { 
            datasets: [
                { label: 'cpu-temperature', data: scatterValues }
            ]
        },
        options: {
            scales: {
                xAxes: [{
                    type: 'time',
                }]
            }
        }
    });
}

// use AJAX route to update plot data
$('#refresh').click(function() {
    $.get('/refreshData', {}, function(newData) {
        updatePlot(newData);
    });
});

