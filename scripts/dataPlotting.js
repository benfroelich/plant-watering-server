function updatePlot(newData) {
    var ctx = document.getElementById('myChart').getContext('2d');
    var scatterchart = new Chart(ctx, {
        type: 'line', 
        data: { 
            datasets: [
                { label: 'cpu-temperature', data: newData }
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

$('#refresh').click(function() {
    $.get('/refreshData', {}, function(newData) {
        console.log(newData);
        updatePlot(newData);
    });
});

