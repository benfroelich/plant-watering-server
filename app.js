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
const pool = mariadb.createPool({user:'administrator', password: 'password', database: 'benny', connectionLimit: 5});

async function getData() {
    let conn, plotData = [];
    try {
        conn = await pool.getConnection();
        sensors = await conn.query("select zone from demo group by zone");

        await Promise.all(sensors.map(async (sensor) => {
            console.log(sensor);
            const sensorLogs = await conn.query("select * from demo where zone='" + sensor.zone + "'");
            // build up data array for chart.js
            var sensorChartEntry = {
                yAxis: String, 
                datasets: {
                    label: String, 
                    data: new Array()
                }
            };

            sensorLogs.forEach(function(row) {
                sensorChartEntry.datasets.data.push({
                    y: row.measurement, x: row.time
                });
            });

            sensorChartEntry.datasets.label = sensor.zone;
            sensorChartEntry.yAxis = sensor.zone + " (" 
                + sensor.units + ")";
            
            plotData.push(sensorChartEntry);
            console.log(sensorChartEntry);
        
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

