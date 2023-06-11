//==LIBRARY YANG DIBUTUHKAN
const express = require('express');
const routes = require('./routes');
const { error } = require('console');
var cookieParser = require('cookie-parser');

const port = 3000;
// == BUAT SERVERNYA
const app = express();
app.set('view engine', 'ejs');

// MIDDLEWARE
const logger = function (req,res,next) {
    console.log('Hit API:', req.method, req.url);
    next();
};
app.use(logger);
app.use(express.urlencoded({extended: false}));
app.use(express.static('public'));
app.use(express.static('images'));
app.use(cookieParser());

app.use(function (req, res, next) {
    const date = new Date();
    console.log(req.url);
    console.log('Time', date.toLocaleString());
    next();
})

//== ROUTING
app.use('/', routes);

// == ERROR HANDLING
app.use(function (req, res, next) {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use(function (error, req, res, next) {
    res.status(error.status || 500);
    res.json({
      error: {
        message: error.message
      }
    });
});

//===========
app.listen(port, function() { 
    console.log(`Server berjalan di port ${port} !`)
});
