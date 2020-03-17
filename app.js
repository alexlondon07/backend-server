// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')

// Init variables
var app = express();

//Cors
app.use(function(req, res, next) {
    // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Origin", "*"); 
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
});

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// server Index
/* var serveIndex = require('serve-index');
app.use(express.static(__dirname + '/'))
app.use('/upload', serveIndex(__dirname + '/upload')); */

// Import Routes
var appRoutes = require('./routes/app');
var userRoutes = require('./routes/user');
var loginRoutes = require('./routes/login');
var hospitalRoutes = require('./routes/hospital');
var doctorRoutes = require('./routes/doctor');
var searchRoutes = require('./routes/search');
var uploadRoutes = require('./routes/upload');
var imagenRoutes = require('./routes/images');

// Routes
app.use('/users', userRoutes);
app.use('/', appRoutes);
app.use('/login', loginRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/doctor', doctorRoutes);
app.use('/search', searchRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imagenRoutes);

//Db
mongoose.connection.openUri('mongodb://localhost:27017/hospitalBD', (err, res) => {
    if(err) throw err;
    console.log('Mongobd running');
});


// Listen request
app.listen(3001, ()=> {
    console.log('Express server running to port 3001 ');
});
