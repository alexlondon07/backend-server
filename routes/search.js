// Requires
var express = require('express');
var Hospital = require('../models/hospital');
var Doctor = require('../models/doctor');
var User = require('../models/user');

// Init variables
var app = express();

/**
 * Búsqueda General
 */
app.get('/all/:search', (req, res, next) => {

    var search = req.params.search;
    var regex = new RegExp( search, 'i');

    Promise.all([
        serchHospitals( search, regex ),
        searchDoctors( search, regex ),
        searchUser( search, regex )
        ])
        .then( response => {
            res.status(200).json({
                ok: true,
                hospitals: response[0],
                doctors: response[1],
                users: response[2],
            });
        });
});

/**
 * Búsqueda por colección
 */
app.get('/collection/:table/:search', (req, res, next) => {

    var search = req.params.search;
    var table = req.params.table;
    var regex = new RegExp( search, 'i');
    var promise;

    switch ( table ) {
        case 'user':
            promise = searchUser( search, regex );
            break;
        case 'doctor':
            promise = searchDoctors( search, regex );
            break;
        case 'hospital':
            promise = serchHospitals( search, regex );
            break;
        default:
            res.status(500).json({
                ok: false,
                message: 'Los tipos de búsqueda sólo son : user, doctor, hospital',
                error: { message: 'Tipo de tabla/coleccion no válido' }
            });
            break;
    }
    promise.then( data => {
        res.status(200).json({
            ok: true,
            [table]: data
        });
    })
});


function serchHospitals( search, regex) {

    return new Promise( (resolve, reject) =>{

        Hospital.find({ name: regex})
            .populate('user', 'name email role')
            .exec((err, hospitals) => {
                if(err){
                    reject('Error al cargar hospitales', err)
                }else{
                    resolve(hospitals);
                }
        });
    });
}

function searchDoctors( search, regex) {

    return new Promise( (resolve, reject) =>{

        Doctor.find({ name: regex})
        .populate('user', 'name email role')
        .exec( (err, doctors) => {
            if(err){
                reject('Error al cargar médicos', err)
            }else{
                resolve(doctors);
            }
        });
    });
}


function searchUser( search, regex) {

    return new Promise( (resolve, reject) =>{

        User.find({}, 'name email role')
            .or([ { 'name': regex }, {'email': regex}])
            .exec((err, users) =>{
            if(err){
                reject('Error al cargar médicos', err)
            }else{
                resolve(users);
            }
        });

    });
}

module.exports = app;