var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	Especialidad = mongoose.model('Especialidad');

var ProveedorSchema = new Schema({
	apPaterno:							{ type: String },
	apMaterno:							{ type: String },
	nombre:								{ type: String },
	telefono:							{ type: String },
	email:								{ type: String },
	rfc:								{ type: String },
	cedula:								{ type: String },
	curp:								{ type: String },
	fecha_alta: 						{ type: Date, default: Date.now },
	estado: 							{ type: String },

	tipo : 								{ type: String }, //Tipo proveedor - definir si será catalogo o enum
	especialidades : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Especialidad' }]
}, {
	toObject: {
		virtuals: true
	},
	toJSON: {
		virtuals: true 
	}
});

ProveedorSchema.virtual('nombre_completo').get(function () {
	return this.nombre + ' ' + this.apPaterno + ' ' + this.apMaterno;
})/*.set(function (setFullNameTo) {
	var split = setFullNameTo.split(' ');
    this.set('nombre', split[0]);
    this.set('apPaterno', split[1]);
    this.set('apMaterno', split[2]);
})*/
;

ProveedorSchema.index({ nombre: 1, apPaterno: 1, apMaterno: 1}, { unique: true});
/*{ unique: true, sparse: true} #You can combine the sparse index option with the unique index option to reject documents that have duplicate values for a field but ignore documents that do not have the indexed key.*/ 

module.exports = mongoose.model('Proveedor', ProveedorSchema);