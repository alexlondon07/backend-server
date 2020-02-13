// Requires
var express = require('express');
var Hospital = require('../models/hospital');
var Doctor = require('../models/doctor');
var User = require('../models/user');

// Init variables
var app = express();


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