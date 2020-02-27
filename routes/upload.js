// Requires
var express = require('express');
var fs = require('fs');
var fileUpload = require('express-fileupload');
var Hospital = require('../models/hospital');
var User = require('../models/user');
var Doctor = require('../models/doctor');


// Init variables
var app = express();

app.use(fileUpload());

/**
 * Búsqueda General
 */
app.put('/:type/:id', (req, res, next) => {
    var type = req.params.type;
    var id = req.params.id;

    var typeAlloweds = ['hospital', 'doctor', 'user']
    if( typeAlloweds.indexOf(type) < 0){
        return  res.status(400).json({
            ok: false,
            message: 'Tipo no valido',
            errors: { message : 'El tipos validos son: ' + typeAlloweds.join(', ') }
        });
    } 

    if (!req.files) {
        return  res.status(400).json({
            ok: false,
            message: 'No seleccióno ningún archivo',
            errors: { message : 'No seleccióno ningún una imagen'}
        });
    }

    var file = req.files.imagen;
    var fileCuted = file.name.split('.');
    var ext = fileCuted[fileCuted.length - 1];

    var extAlloweds = ['png', 'jpg', 'gif', 'jpeg'];
    if( extAlloweds.indexOf(ext) < 0){
        return  res.status(400).json({
            ok: false,
            message: 'Extensión no permitida',
            errors: { message : 'Las extensiones permitidas son: ' + extAlloweds.join(', ') }
        });
    } 

    var fileName = `${id}-${ new Date().getMilliseconds()}.${ext}`;

    // Mover l archivo temporal a una ruta
    var path = `./upload/${type}/${fileName}`;
    file.mv( path, err=> {
        if( err ){
            return  res.status(500).json({
                ok: false,
                message: 'Error al mover el archivo',
                errors: err
            });
        }

        // Subimos el archivo segun el tipo
        uploadForType( type, id, fileName, path, res)
    })
    
});

function uploadForType( type, id, fileName, path, res) {
    if( type === 'user') {
        User.findById(id, (err, user) =>{

            if (!user){
                return  res.status(404).json({
                    ok: false,
                    message: 'Usuario no existe',
                    errors: { message : 'Usuario no existe' } 
                });
            }

            var pathOld = './upload/user/' + user.img;
            // Elimina imagen anterior
            fs.unlink(pathOld, function (err) {
                if (!err){
                    console.log('File deleted!' + pathOld);
                }
            }); 

            user.img = fileName;
            user.save( (err, userUpdated) =>{          
                userUpdated.password = ':)';
                return  res.status(200).json({
                    ok: true,
                    message: 'Imagen subida actualizada',
                    user: userUpdated
                });
            });
        });
    }

    if( type === 'doctor') {
        Doctor.findById(id, (err, doctor) =>{

            if (!doctor){
                return  res.status(404).json({
                    ok: false,
                    message: 'Doctor no existe',
                    errors: { message : 'Doctor no existe' } 
                });
            }

            var pathOld = './upload/doctor/' + doctor.img;
            // Elimina imagen anterior
            fs.unlink(pathOld, function (err) {
                if (!err){
                    console.log('File deleted!' + pathOld);
                }
            }); 

            doctor.img = fileName;
            doctor.save( (err, doctorUpdated) =>{          
                return  res.status(200).json({
                    ok: true,
                    message: 'Imagen del doctor subida actualizada',
                    doctor: doctorUpdated
                });
            });
        });
    }

    if( type === 'hospital') {
        Hospital.findById(id, (err, hospital) =>{
            
            if (!hospital){
                return  res.status(404).json({
                    ok: false,
                    message: 'Hospital no existe',
                    errors: { message : 'Hospital no existe' } 
                });
            }

            var pathOld = './upload/hospital/' + hospital.img;
            // Elimina imagen anterior
            fs.unlink(pathOld, function (err) {
                if (!err){
                    console.log('File deleted!' + pathOld);
                }
            }); 

            hospital.img = fileName;
            hospital.save( (err, hospitalUpdated) =>{          
                return  res.status(200).json({
                    ok: true,
                    message: 'Imagen del hospital subida actualizada',
                    hospital: hospitalUpdated
                });
            });
        });
    }
}

module.exports = app;