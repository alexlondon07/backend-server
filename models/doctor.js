var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var doctorSchema = new Schema({
    name: { type: String, required: [true, 'El nombre es obligatorio'] },
    img: { type: String, required: false },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    hospital: { type: Schema.Types.ObjectId, ref: 'Hospital', 
    required: [true, 'El id hospital es un campo obligatorio'] }
});

module.exports = mongoose.model('Doctor', doctorSchema);