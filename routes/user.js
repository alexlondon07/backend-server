var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var mdAuthentication = require('../middlewares/authentication');

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
        res.status(200).json({
            ok: true,
            users: users
        });
    })
});

/**
 * Método para actualizar usuario
 */
app.put('/:id',mdAuthentication.verifyToken, (req, res) => {
    
    var id = req.params.id;
    var body = req.body;

    User.findById(id, ( err, user ) => {
        if( err ) {
            return  res.status(500).json({
                ok: false,
                message: 'Error al buscar el usuario',
                erros: err
            });
        }
        if( !user ){
            return  res.status(400).json({
                ok: false,
                message: 'El usuario con el ' + id + ' no existe',
                erros: { message: 'No existe un usuario con ese id'}
            });
        }
        user.name = body.name;
        user.email = body.email;
        user.role = body.role;

        user.save( (err, userUpdated) => {
            if( err ) {
                return  res.status(400).json({
                    ok: false,
                    message: 'Error al actualizar el usuario',
                    erros: err
                });
            }
    
            userUpdated.password = ':)';
            res.status(200).json({
                ok: true,
                user: userUpdated
            });
    
        });
    });
});

/**
 * Método para borrar un usuario
 */
app.delete('/:id',mdAuthentication.verifyToken, (req, res) => {
    
    var id = req.params.id;

    User.findByIdAndRemove(id, (err, userDeleted) => {
        if( err ) {
            return  res.status(500).json({
                ok: false,
                message: 'Error al borrar el usuario',
                erros: err
            });
        }

        if( !userDeleted ){
            return  res.status(400).json({
                ok: false,
                message: 'No existe un usuario con ese id ' + id,
                erros: { message: 'No existe un usuario con ese id'}
            });
        }

        res.status(200).json({
            ok: true,
            user: userDeleted
        });
    });
});

/**
 * Método para guardar usuario
 */
app.post('/',mdAuthentication.verifyToken, (req, res) => {
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
                message: 'Error guardando el usuario',
                erros: err
            });
        }
        res.status(404).json({
            ok: true,
            user: userSaved,
            userToken: req.user
        });
    });
});

module.exports = app;