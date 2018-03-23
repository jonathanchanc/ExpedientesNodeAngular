var mongoose = require('mongoose'),
	Schema = mongoose.Schema,

	//AutoIncrement = require('mongoose-sequence'),
	User = mongoose.model('User'),
	Oficina = mongoose.model('Oficina'),
	Expediente = mongoose.model('Expediente'),
	dateformat = require('dateformat');

var RevisionSchema = new Schema({
	
	revision:						{ type: String },
	estado: 						{ type: String },
	expediente: 					{ type: mongoose.Schema.Types.ObjectId, ref: 'Expediente' },

	usuario: {
		_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
		usuario: 					{ type: String },
		nombre: 					{ type: String }, //DEFINIR SI SERÄ NOMBRE COMPLETA O CAMPO POR CAMPO
		fecha:						{ type: Date, default: Date.now },
		oficina: {
			_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Oficina' },
			nombre: 				{ type: String },
		},
	}

}, {
	toObject: {
		virtuals: true
	},
	toJSON: {
		virtuals: true 
	}
});

RevisionSchema.virtual('expediente.nombre_completo').get(function () {
	return this.expediente.nombre + ' ' + this.expediente.apPaterno + ' ' + this.expediente.apMaterno;
});

RevisionSchema.virtual('fecha_revision').get(function () {
	return dateformat(this.usuario.fecha, 'dd/mm/yyyy');
});


module.exports = mongoose.model('Revision', RevisionSchema);