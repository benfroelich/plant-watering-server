const express = require('express'),
      app = express(),
      port = 3000;

// pug template configuration
app.set('view engine', 'pug');
app.set('views', __dirname + '/' + 'views');

// routes
app.get('/', (req, res) => res.render('stats'));

// start server
app.listen(port, () => console.log(`Example app listening on port ${port}!`));


