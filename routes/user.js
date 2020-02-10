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

app.post('/', (req, res) => {
    var body = req.body;

    var user = new User({
        name: body.name,
        email: body.email,
        password: body.password,
        img: body.img,
        role: body.role
    })

    user.save( (err, userSaved) => {
        if( err ) {
            return  res.status(400).json({
                ok: false,
                message: 'Error saving the user',
                erros: err
            });
        }
        res.status(404).json({
            ok: true,
            user: userSaved
        });
    });
});

module.exports = app;