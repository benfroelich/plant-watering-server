const express = require('express'),
      app = express(),
      port = 3000,
      fs = require('fs'),
      d3 = require('d3'),
      _ = require('lodash'),
      moment = require('moment');

// pug template configuration
app.set('view engine', 'pug');
app.set('views', __dirname + '/' + 'views');
app.use(express.static('scripts'))
app.locals.pretty = true;

// parse csv datalog
function getData(path) {
    var raw = fs.readFileSync(path, 'utf8');
    var csv = d3.csvParse(raw);
    var data = [];
    csv.forEach(function(datum) {
        data.push({x: moment(datum.timestamp), y: datum.cpu_temperature});
    });
    console.log(`plotting ${data.length} points`);
    return data;
}

// routes
app.get('/', (req, res) => {
    var data;
    // process the data csv and render
    res.render('stats');
});

// AJAX for updating plots
app.get('/refreshData', (req, res) => {
    console.log('sending new data');
    res.send(getData('/home/pi/cpu_temp.csv'));
});
// start server
app.listen(port, () => console.log(`Example app listening on port ${port}!`));


