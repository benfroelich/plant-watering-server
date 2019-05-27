var fs          = require('fs'),
    config      = require('ini'),
    dateFormat  = require('dateformat');

const express = require('express'),
      app = express(),
      port = 3000,
      mariadb = require('mariadb');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

const settingsPath = '../control/settings.json';

require('dotenv').config();
// pug template configuration
app.set('view engine', 'pug');
app.set('views', __dirname + '/' + 'views');
// tell the express framework that the css is in the public directory
app.use(express.static(__dirname + "/public"));
// client-side scripts are in the scrits directory
app.use(express.static('scripts'));
// dygraphs
app.use(express.static('node_modules/dygraphs/dist'));
app.locals.pretty = true;

const mariadbConnection = {
    user: process.env.PLANT_WATERING_DB_USER, 
    password: process.env.PLANT_WATERING_DB_PW, 
    database: process.env.PLANT_WATERING_DB,
    connectionLimit: 5
};

// MariaDB connection 
const pool = mariadb.createPool(mariadbConnection);

async function getData(params) {
    let conn, plotData = {datasets: []};
    try {
        conn = await pool.getConnection();
        sensors = await conn.query("select id from " + 
            process.env.PLANT_WATERING_DB_TABLE + 
            " group by id");
        console.log(sensors);
        const formatString = "yyyy-mm-dd hh:mm:ss"
        await Promise.all(sensors.map(async (sensor) => {
            let queryString = 
                "select * from " + process.env.PLANT_WATERING_DB_TABLE 
                + " where id='" + sensor.id + "' and time between '"
                + dateFormat(params.min, formatString) + "' and '" 
                + dateFormat(params.max, formatString) + "'";
            let sensorLogs = await conn.query(queryString);
            console.log(queryString);
            // build up data skeleton
            var entry = {
                label: sensor.id,
                yAxis: sensorLogs[0].units,
                data: []
            };

            // insert data
            sensorLogs.forEach(function(row) {
                entry.data.push({
                    y: row.measurement, x: row.time
                });
            });

            plotData.datasets.push(entry);
        }));
    } catch (err) {
        console.log(err.message);
        throw err;
    } finally {
        if (conn) {
            conn.end();
            return plotData;
        }
    }
}

// routes
app.get('/', (req, res) => {
    res.render('stats');
});

function loadSettings() {
    const settings = JSON.parse(fs.readFileSync('../control/settings.json'));
    console.log("loaded settings:");
    console.log(settings);
    return settings;
}

// the settings passed back from the html form are only 
// encoded as strings. numeric conversion is handled here
function updateSettings(settings) {
    settings.settings.forEach(function(ch) {
        ch.interval_days = Number(ch.interval_days);
        ch.duration_mins = Number(ch.duration_mins);
        ch.thresh_pct = Number(ch.thresh_pct);
    });
    
    const data = JSON.stringify(settings, null, 2);
    fs.writeFileSync(settingsPath, data);
}

app.get('/help', (req, res) => {
    res.render('help');
});

app.get('/settings', (req, res) => {
    res.render('settings', loadSettings());
});

app.post('/settings', (req, res) => {
    console.log("new settings:");
    console.log(req.body);
    updateSettings(req.body);
    res.redirect('/settings');
});

function handleError(err) {
    console.log(err);
    return err;
}

// AJAX for updating plots
app.get('/refreshData', function(req, res) {
    getData(req.query).then(
      function(data) { // success
        console.log("sending data via AJAX");
        res.send(data);
      },
      function(err) { // error
          console.log(err.message);
          res.send({status: "failed", reason: err.message});
      });
});

// start server
app.listen(port, () => {
    console.log(`plant watering server listening on port ${port}!`);
});

