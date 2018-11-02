function updatePlot(newData) {
    console.log(newData);
    var ctx = document.getElementById('timePlot').getContext('2d');
    var scatterchart = new Chart(ctx, {
        type: 'line', 
        data: newData[0],
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

