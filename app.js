// Requires
var express = require('express');
var mongoose = require('mongoose');

// Init variables
var app = express();

// Import Routes
var appRoutes = require('./routes/app');
var userRoutes = require('./routes/user');

// Routes
app.use('/users', userRoutes);
app.use('/', appRoutes);

//Db
mongoose.connection.openUri('mongodb://localhost:27017/hospitalBD', (err, res) => {
    if(err) throw err;
    console.log('Mongobd running');
});


// Listen request
app.listen(3001, ()=> {
    console.log('Express server running to port 3001 ');
});
