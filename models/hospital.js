var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var hospitalSchema = new Schema({
    name: { type: String, unique:true, required: [true, 'El nombre es obligatorio'] },
    img: { type: String, required: false },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
});
// hospitalSchema.plugin( uniqueValidator , { message: '{PATH} debe ser único' });
hospitalSchema.plugin( uniqueValidator , { message: 'El nombre debe ser único' });


module.exports = mongoose.model('Hospital', hospitalSchema);
