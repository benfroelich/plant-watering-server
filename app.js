// use dotenv for configs in development
require('dotenv').config();

const express = require('express'),
      app = express(),
      port = 3000,
      mariadb = require('mariadb');

// pug template configuration
app.set('view engine', 'pug');
app.set('views', __dirname + '/' + 'views');
app.use(express.static('scripts'))
app.locals.pretty = true;

// MariaDB connection 
const pool = mariadb.createPool({
    user: process.env.DB_USER, 
    password: process.env.DB_PASSWORD, 
    database: process.env.DB,
    connectionLimit: 5
});

async function getData() {
    let conn, plotData = {datasets: []};
    try {
        conn = await pool.getConnection();
        sensors = await conn.query("select zone from " + process.env.DATALOG_TABLE + 
            " group by zone");

        await Promise.all(sensors.map(async (sensor) => {
            const sensorLogs = await conn.query("select * from " + process.env.DATALOG_TABLE 
                + " where zone='" + sensor.zone + "'");
            // build up data skeleton
            var entry = {
                label: sensor.zone,
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
        throw err;
    } finally {
        if (conn) {
            conn.end();
            console.log("plotData:");
            console.log(plotData);
            return plotData;
        }
    }
}

// routes
app.get('/', (req, res) => {
    res.render('stats');
});

function handleError(err) {
    console.log(err);
    return err;
}

// AJAX for updating plots
app.get('/refreshData', async function(req, res) {
    const data = await getData();
    console.log("sending data via AJAX");
    res.send(data);
});

// start server
app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});

