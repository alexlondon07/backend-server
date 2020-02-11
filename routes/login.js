var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

// Init variables
var app = express();

var User = require('../models/user');

app.post('/', (req, res) => {
    var body = req.body;

    User.findOne({ email: body.email}, (err, userBD)=>{
        if( err ) {
            return  res.status(500).json({
                ok: false,
                message: 'Error al buscar usuarios',
                erros: err
            });
        }
        if( !userBD ){
            return  res.status(400).json({
                ok: false,
                message: 'Credenciales incorrectas --email',
                erros: err
            });
        }

        if( !bcrypt.compareSync(body.password, userBD.password)) {
            return  res.status(400).json({
                ok: false,
                message: 'Credenciales incorrectas --password',
                erros: err
            });
        }

        // Generar Token
        userBD.password = ':)';
        var token = jwt.sign({ user: userBD }, 'este-es-un-c-dificl', { expiresIn: 14400} ); // 4 Horas

        res.status(200).json({
            ok: true,
            user: userBD,
            token: token,
            id: userBD._id
        });
    })
})


module.exports = app;