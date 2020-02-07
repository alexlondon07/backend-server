// Requires
var express = require('express');

// Init variables
var app = express();


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
