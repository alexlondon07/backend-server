var express = require('express');
var mdAuthentication = require('../middlewares/authentication');

// Init variables
var app = express();

var Doctor = require('../models/doctor');

// Routes
app.get('/', (req, res, next) => {

    Doctor.find({})
    .exec(
        (err, doctors) => {
        if( err ) {
            return  res.status(500).json({
                ok: false,
                message: 'Error al obtener los doctores',
                erros: err
            });
        }   
        res.status(200).json({
            ok: true,
            doctors: doctors
        });
    })
});

/**
 * Método para guardar un médico
 */
app.post('/',mdAuthentication.verifyToken, (req, res) => {
    var body = req.body;

    var doctor = new Doctor({
        name: body.name,
        user: req.user._id,
        hospital: body.hospital
    })

    doctor.save( (err, doctorSaved) => {
        if( err ) {
            return  res.status(400).json({
                ok: false,
                message: 'Error al crear el doctor',
                erros: err
            });
        }
        res.status(404).json({
            ok: true,
            doctor: doctorSaved
        });
    });
});

/**
 * Método para actualizar un médico
 */
app.put('/:id',mdAuthentication.verifyToken, (req, res) => {
    
    var id = req.params.id;
    var body = req.body;

    Doctor.findById(id, ( err, doctor ) => {
        if( err ) {
            return  res.status(500).json({
                ok: false,
                message: 'Error al buscar el usuario',
                erros: err
            });
        }
        if( !doctor ){
            return  res.status(400).json({
                ok: false,
                message: 'El doctor con el ' + id + ' no existe',
                erros: { message: 'No existe un doctor con ese id'}
            });
        }
        doctor.name = body.name;
        doctor.user = req.user._id;
        doctor.hospital = body.hospital;

        doctor.save( (err, doctorUpdated) => {
            if( err ) {
                return  res.status(400).json({
                    ok: false,
                    message: 'Error al actualizar el doctor',
                    erros: err
                });
            }
    
            res.status(200).json({
                ok: true,
                doctor: doctorUpdated
            });
    
        });
    });
});

/**
 * Método para borrar un médico
 */
app.delete('/:id',mdAuthentication.verifyToken, (req, res) => {
    
    var id = req.params.id;

    Doctor.findByIdAndRemove(id, (err, doctorDeleted) => {
        if( err ) {
            return  res.status(500).json({
                ok: false,
                message: 'Error al borrar el doctor',
                erros: err
            });
        }

        if( !doctorDeleted ){
            return  res.status(400).json({
                ok: false,
                message: 'No existe un doctor con ese id ' + id,
                erros: { message: 'No existe un doctor con ese id'}
            });
        }

        res.status(200).json({
            ok: true,
            doctor: doctorDeleted
        });
    });
});
module.exports = app;