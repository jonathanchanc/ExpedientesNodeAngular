var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var OficinaSchema = new Schema({
	nombre:								{ type: String, unique: true },
	direccion:							{ type: String },
	telefono:							{ type: String },
	email:								{ type: String },
	estado: 							{ type: String }
});

module.exports = mongoose.model('Oficina', OficinaSchema);