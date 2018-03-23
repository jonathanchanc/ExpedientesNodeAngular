var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var EspecialidadSchema = new Schema({
	nombre:								{ type: String, unique: true },
	descripcion:						{ type: String },
	padecimientos:						{ type: String },
	estado: 							{ type: String }
});

module.exports = mongoose.model('Especialidad', EspecialidadSchema);