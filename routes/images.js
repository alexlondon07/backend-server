var express = require('express');
const path = require('path');
var fs = require('fs');

// Init variables
var app = express();


// Routes
app.get('/', (req, res, next) => {
    return res.status(200).json({
        ok: true,
        message: 'Successful request'
    })
});

app.get('/:type/:img', (req, res, next) => {
    
    var type = req.params.type;
    var img =  req.params.img;

    var pathImg = path.resolve( __dirname, `../upload/${type}/${img}`);
    if( fs.existsSync(pathImg) ){
        res.sendfile( pathImg );
    } else {
        var pathNoImg = path.resolve( __dirname, '../assets/no-img.jpg')
        res.sendFile( pathNoImg );
    }
});

module.exports = app;