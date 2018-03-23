var mongoose = require('mongoose'),
	Schema = mongoose.Schema,

	AutoIncrement = require('mongoose-sequence'),
	dateformat = require('dateformat');

var ExpedienteSchema = new Schema({
	apPaterno:							{ type: String },
	apMaterno:							{ type: String },
	nombre:								{ type: String },
	telefono:							{ type: String },
	email:								{ type: String },
	edad: 								{ type: Number },
	sexo:								{ type: String },
	peso:								{ type: Number },
	talla:								{ type: Number },
	ta:									{ type: String },
	pulso:								{ type: Number },
	lugar_nacimiento:					{ type: String },
	fecha_nacimiento:					{ type: Date },
	estado_civil:						{ type: String, enum: ['Casado(a)','Divorciado(a)','Soltero(a)','Union Libre','Viudo(a)'] },
	escolaridad:						{ type: String, enum: ['Ninguna','Primaria','Secundaria','Preparatoria','Licenciatura','Posgrado'] },
	religion:							{ type: String },
	sedentarismo:						{ type: String },
	tipo_relaciones_sexuales:			{ type: String },
	parejas_sexuales:					{ type: Number },
	alimentacion:						{ type: String, enum: ['Buena','Regular','Mala'] },
	habitacion: 						{ type: String, enum: ['Buena','Regular','Mala'] },
	higiene: 							{ type: String, enum: ['Buena','Regular','Mala'] },
	ocupacion: 							{ type: String },
	tabaquismo: 						{ type: String },
	alcoholismo: 						{ type: String },
	quirurgicos: 						{ type: String },
	traumaticos: 						{ type: String },
	alergicos: 							{ type: String },
	transfusion: 						{ type: String },
	enfermedades_infecto_contagiosas:	{ type: String },
	diabeticos: 						{ type: String },
	oncologicos: 						{ type: String },
	congenitos: 						{ type: String },
	enfermedades_degenerativas: 		{ type: String },
	otros_hereditarios: 				{ type: String },
	menarca: 							{ type: Number },
	ritmo: 								{ type: Number },
	ivsa: 								{ type: Number },
	fur: 								{ type: Date },
	epe: 								{ type: Number },
	embarazos: 							{ type: Number },
	partos: 							{ type: Number },
	abortos: 							{ type: Number },
	cesareas: 							{ type: Number },
	mpf: 								{ type: String },
	lactancia: 							{ type: String },
	fue: 								{ type: Date },
	numero_hijos: 						{ type: Number },
	estado: 							{ type: String }

}, {
	toObject: {
		virtuals: true
	},
	toJSON: {
		virtuals: true 
	}
});

ExpedienteSchema.virtual('nombre_completo').get(function () {
	return this.nombre + ' ' + this.apPaterno + ' ' + this.apMaterno;
});

ExpedienteSchema.virtual('fecha_nacimiento_corta').get(function () {
	return dateformat(this.fecha_nacimiento, 'dd/mm/yyyy');
});

ExpedienteSchema.index({ nombre: 1, apPaterno: 1, apMaterno: 1}, { unique: true });


ExpedienteSchema.plugin(AutoIncrement, {id: 'folio_expediente',inc_field: 'numero_expediente'}); //Automaticamente añade el campo "numero_expediente" al esquema

module.exports = mongoose.model('Expediente', ExpedienteSchema);