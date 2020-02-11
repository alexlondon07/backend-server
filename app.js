// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')

// Init variables
var app = express();

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Import Routes
var appRoutes = require('./routes/app');
var userRoutes = require('./routes/user');
var loginRoutes = require('./routes/login');

// Routes
app.use('/users', userRoutes);
app.use('/', appRoutes);
app.use('/login', loginRoutes);

//Db
mongoose.connection.openUri('mongodb://localhost:27017/hospitalBD', (err, res) => {
    if(err) throw err;
    console.log('Mongobd running');
});


// Listen request
app.listen(3001, ()=> {
    console.log('Express server running to port 3001 ');
});
