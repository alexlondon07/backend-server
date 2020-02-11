var express = require('express');
var bcrypt = require('bcryptjs');

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
                message: 'Error al obtener los usuarios',
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
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    })

    user.save( (err, userSaved) => {
        if( err ) {
            return  res.status(400).json({
                ok: false,
                message: 'Error guardado el usuario',
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