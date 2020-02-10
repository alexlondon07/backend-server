// Requires
var express = require('express');
var mongoose = require('mongoose');

// Init variables
var app = express();


//Bb
mongoose.connection.openUri('mongodb://localhost:27017/hospitalBD', (err, res) => {
    if(err) throw err;
    console.log('Mongobd running');
});

// Routes
app.get('/', (req, res, next) => {
    res.status(404).json({
        ok: true,
        message: 'Successful request'
    })
});


// Listen request
app.listen(3001, ()=> {
    console.log('Express server running to port 3001 ');
});
