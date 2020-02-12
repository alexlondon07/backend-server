var express = require('express');
var mdAuthentication = require('../middlewares/authentication');

// Init variables
var app = express();

var Hospital = require('../models/hospital');

// Routes
app.get('/', (req, res, next) => {

    Hospital.find({})
    .populate('user', 'name email')
    .exec(
        (err, hospitals) => {
        if( err ) {
            return  res.status(500).json({
                ok: false,
                message: 'Error al obtener los hospitales',
                erros: err
            });
        }   
        res.status(200).json({
            ok: true,
            hospitals: hospitals
        });
    })
});

/**
 * Método para guardar hospital
 */
app.post('/',mdAuthentication.verifyToken, (req, res) => {
    var body = req.body;

    var hospital = new Hospital({
        name: body.name,
        img: body.img,
        user: req.user._id
    })

    hospital.save( (err, hospitalSaved) => {
        if( err ) {
            return  res.status(400).json({
                ok: false,
                message: 'Error al crear el hospital',
                erros: err
            });
        }
        res.status(404).json({
            ok: true,
            hospital: hospitalSaved
        });
    });
});

/**
 * Método para actualizar un hospital
 */
app.put('/:id',mdAuthentication.verifyToken, (req, res) => {
    
    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, ( err, hospital ) => {
        if( err ) {
            return  res.status(500).json({
                ok: false,
                message: 'Error al buscar el usuario',
                erros: err
            });
        }
        if( !hospital ){
            return  res.status(400).json({
                ok: false,
                message: 'El hospital con el ' + id + ' no existe',
                erros: { message: 'No existe un hospital con ese id'}
            });
        }
        hospital.name = body.name;
        hospital.user = req.user._id;

        hospital.save( (err, hospitalUpdated) => {
            if( err ) {
                return  res.status(400).json({
                    ok: false,
                    message: 'Error al actualizar el hospital',
                    erros: err
                });
            }
    
            res.status(200).json({
                ok: true,
                hospital: hospitalUpdated
            });
    
        });
    });
});

/**
 * Método para borrar un hospital
 */
app.delete('/:id',mdAuthentication.verifyToken, (req, res) => {
    
    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalDeleted) => {
        if( err ) {
            return  res.status(500).json({
                ok: false,
                message: 'Error al borrar el hospital',
                erros: err
            });
        }

        if( !hospitalDeleted ){
            return  res.status(400).json({
                ok: false,
                message: 'No existe un hospital con ese id ' + id,
                erros: { message: 'No existe un hospital con ese id'}
            });
        }

        res.status(200).json({
            ok: true,
            hospital: hospitalDeleted
        });
    });
});



module.exports = app;