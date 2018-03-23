var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	Especialidad = mongoose.model('Especialidad');

var DoctorSchema = new Schema({
	apPaterno:							{ type: String },
	apMaterno:							{ type: String },
	nombre:								{ type: String },
	telefono:							{ type: String },
	email:								{ type: String },
	fecha_alta: 						{ type: Date, default: Date.now },
	estado: 							{ type: String },

	especialidades : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Especialidad' }]
});

DoctorSchema.index({ nombre: 1, apPaterno: 1, apMaterno: 1}, { unique: true });

module.exports = mongoose.model('Doctor', DoctorSchema);