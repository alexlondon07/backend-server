var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    name: { type: String , required: [true, 'El nombre es requerido'] },
    email: { type: String, uniuqe:true, required: [true, 'El email es requerido'] },
    password: { type: String, required: [true, 'La contraseña es requerida'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE' },
});

module.exports = monggose.model('User', userSchema);