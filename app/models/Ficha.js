var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	//autoIncrement = require('mongoose-auto-increment'),
	AutoIncrement = require('mongoose-sequence'),
	User = mongoose.model('User'),
	Oficina = mongoose.model('Oficina'),
	Cliente = mongoose.model('Cliente'),
	Programa = mongoose.model('Programa'),
	Proveedor = mongoose.model('Proveedor'),
	Especialidad = mongoose.model('Especialidad'),
	dateformat = require('dateformat');
	//,Factura = mongoose.model('Factura')
	;

/* NUEVO SCHEMA TENTATIVO PARA FICHAS */

var FichaSchema = new Schema({
	folio:							{ type: Number },
	anio:							{ type: Number },
	//fecha_alta:						{ type: Date, default: Date.now },
	monto_total:					{ type: Number },
	comentario:						{ type: String },
	pagado:							{ type: String },
	pagado_parcialmente:			{ type: String },
	fecha_pago: 					{ type: Date },
	//fecha_ultima_modificacion: 		{ type: Date },
	estado: 						{ type: String },
	
	cliente: {
		_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente' },
		apPaterno: 					{ type: String },
		apMaterno: 					{ type: String },
		nombre: 					{ type: String },
		direccion: 					{ type: String },
		telefono: 					{ type: String },
		email: 						{ type: String },
		afiliado: 					{ type: String },
		credencial: 				{ type: Number },
	},

	usuario: {
		_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
		usuario: 					{ type: String },
		nombre: 					{ type: String }, //DEFINIR SI SERÄ NOMBRE COMPLETA O CAMPO POR CAMPO
		fecha:						{ type: Date, default: Date.now },
		oficina: {
			_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Oficina' },
			nombre: 				{ type: String },
		},
	},

	usuario_modifico: {
		_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
		usuario: 					{ type: String },
		nombre: 					{ type: String },
		fecha:						{ type: Date },
		oficina: {
			_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Oficina' },
			nombre: 				{ type: String },
		},
	},

	programas: [
		{
			index: 					{ type: Number }, 
			_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Programa' },
			nombre: 				{ type: String },
			precio: 				{ type: Number },
			descuento: 				{ type: Number },
			total: 					{ type: Number },
			monto_apoyo_terceros: 	{ type: Number },
			monto_suciqroo: 		{ type: Number },
			pagado: 				{ type: String, default: 'No' },
			fecha_pago: 			{ type: Date },
			proveedor: {
				_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Proveedor' },
				nombre: 			{ type: String },
			},
			especialidad: {
				_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Especialidad' },
				nombre: 			{ type: String },
			},
			tiene_descuento: 		{ type: String },
			cortesia: 				{ type: String },
			factura: {
				_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Factura' },
				folio_factura: 		{ type: String },
			},
		}
	],

}, {
	toObject: {
		virtuals: true
	},
	toJSON: {
		virtuals: true 
	}
});

FichaSchema.index({ folio: 1, anio: 1 }, { unique: true });

FichaSchema.virtual('folio_ficha').get(function () {
	var strFolio = ''+this.folio;
	strFolio = ('000000'+strFolio).substring(strFolio.length);
	return this.anio + '-' + strFolio;
}).set(function (folio_ficha) {
	var split = folio_ficha.split('-');
	if(split.length == 2){
    	this.set('anio', split[0]);
    	this.set('folio', split[1]);
    }
})
;

FichaSchema.virtual('cliente.nombre_completo').get(function () {
	return this.cliente.nombre + ' ' + this.cliente.apPaterno + ' ' + this.cliente.apMaterno;
});

FichaSchema.virtual('programas_nombres').get(function () {
	var strProgramas = '';
	if(this.programas != undefined){
		for(i = 0; i < this.programas.length; ++i){
			strProgramas += this.programas[i].nombre;
			strProgramas += (i != (this.programas.length - 1) ) ? ', ' : '';
		}
	}
	return strProgramas;
});

FichaSchema.virtual('fecha_corta').get(function () {
	return dateformat(this.usuario.fecha, 'dd/mm/yyyy');
});

//FichaSchema.plugin(autoIncrement.plugin, { model: 'Ficha', field: 'folio', startAt: 1 }); 
FichaSchema.plugin(AutoIncrement, {id: 'folio_ficha', inc_field: 'folio', reference_fields: 'anio' });

module.exports = mongoose.model('Ficha', FichaSchema);