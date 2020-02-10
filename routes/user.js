var express = require('express');

// Init variables
var app = express();

var User = require('../models/user');
// Routes
app.get('/', (req, res, next) => {

    User.find({}, 'name email img role')
    .exec(
        (err, users) => {
        if( err ) {
            return  res.status(500).json({
                ok: false,
                message: 'Error get all users',
                erros: err
            });
        }
            
        res.status(404).json({
            ok: true,
            users: users
        });
    })


});

module.exports = app;