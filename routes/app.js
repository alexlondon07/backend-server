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

module.exports = app;