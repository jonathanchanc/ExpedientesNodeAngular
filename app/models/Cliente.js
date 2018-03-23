var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var ClienteSchema = new Schema({
	apPaterno:							{ type: String },
	apMaterno:							{ type: String },
	nombre:								{ type: String },
	telefono:							{ type: String },
	direccion:							{ type: String },
	email:								{ type: String },
	fecha_alta: 						{ type: Date, default: Date.now },
	afiliado: 							{ type: String },
	credencial: 						{ type: Number, unique: true, sparse: true },
	estado: 							{ type: String }
}, {
	toObject: {
		virtuals: true
	},
	toJSON: {
		virtuals: true 
	}
});

ClienteSchema.virtual('nombre_completo').get(function () {
	return this.nombre + ' ' + this.apPaterno + ' ' + this.apMaterno;
});

ClienteSchema.index({ nombre: 1, apPaterno: 1, apMaterno: 1}, { unique: true });

module.exports = mongoose.model('Cliente', ClienteSchema);