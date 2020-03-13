var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

// Init variables
var app = express();

var User = require('../models/user');


// Google
const CLIENT_ID = require('../config/config').CLIENT_ID;
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    // const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

/**
 * Login Google
 */
app.post('/google', async (req, res) => {

    let token = req.body.token;

    let googleUser = await verify(token).
        catch(e =>{
            return  res.status(403).json({
                ok: false,
                message: 'Token no valido'
            });
        });

    User.findOne ( { email: googleUser.email }, (err, userBD) =>{
        if( err ) {
            return  res.status(500).json({
                ok: false,
                message: 'Error al buscar usuarios',
                erros: err
            });
        }
    });    

    if( userBD ){

        if (userBD.google === false){
            return  res.status(400).json({
                ok: false,
                message: 'Debe usar su autenticación normal'
            });
        } else {
            // Generar Token
            userBD.password = ':)';
            var token = jwt.sign({ user: userBD }, SEED, { expiresIn: 14400} ); // 4 Horas

            res.status(200).json({
                ok: true,
                user: userBD,
                token: token,
                id: userBD._id
            });
        }
    } else {
        // Usuario no existe

        var user = new User({
            name: googleUser.name,
            email: googleUser.email,
            img: googleUser.img,
            google: true,
            password: ':)'
        });

        user.save( (err, userSaved) => {

            var token = jwt.sign({ user: userBD }, SEED, { expiresIn: 14400} ); // 4 Horas

            res.status(404).json({
                ok: true,
                user: userSaved,
                token: token,
                id: userBD._id
            });
        });
    
    }

    return  res.status(200).json({
        ok: true,
        message: 'Ok',
        googleUser: googleUser
    });
});

/**
 * Login Normal
 */
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
        var token = jwt.sign({ user: userBD }, SEED, { expiresIn: 14400} ); // 4 Horas

        res.status(200).json({
            ok: true,
            user: userBD,
            token: token,
            id: userBD._id
        });
    })
})


module.exports = app;