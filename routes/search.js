// Requires
var express = require('express');
var Hospital = require('../models/hospital');


// Init variables
var app = express();


app.get('/all/:search', (req, res, next) => {

    var search = req.params.search;
    var regex = new RegExp( search, 'i');

    serchHospitals( search, regex).then(hospitals=>{
        res.status(200).json({
            ok: true,
            hospitals
        });
    })
});

function serchHospitals( search, regex) {

    return new Promise( (resolve, reject) =>{

        Hospital.find({ name: regex}, (err, hospitals) => {

            if(err){
                reject('Error al cargar hospitales', err)
            }else{
                resolve(hospitals);
            }
        });
    });
}

module.exports = app;