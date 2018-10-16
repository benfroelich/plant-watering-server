const express = require('express'),
      app = express(),
      port = 3000,
      fs = require('fs'),
      d3 = require('d3'),
      _ = require('lodash'),
      moment = require('moment'),
      mariadb = require('mariadb');

// pug template configuration
app.set('view engine', 'pug');
app.set('views', __dirname + '/' + 'views');
app.use(express.static('scripts'))
app.locals.pretty = true;

// MariaDB connection 
const pool = mariadb.createPool({user:'administrator', password: 'password', database: 'benny', connectionLimit: 5});

async function getData() {
    let conn, data;
    try {
        conn = await pool.getConnection();
        data = await conn.query("SELECT * from datalog4");
        data.forEach(function(row) {
            console.log(row.measurement + " " + row.units);
        });
    } catch (err) {
        throw err;
    } finally {
        if (conn) {
            conn.end();
            return data;
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

