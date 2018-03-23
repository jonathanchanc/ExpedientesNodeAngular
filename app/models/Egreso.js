var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	//autoIncrement  = require('mongoose-auto-increment'),
	AutoIncrement = require('mongoose-sequence'),
	User = mongoose.model('User'),
	Oficina = mongoose.model('Oficina')
	;

/* NUEVO SCHEMA TENTATIVO PARA FICHAS */

var EgresoSchema = new Schema({
	folio:							{ type: Number },
	anio:							{ type: Number },
	fecha:							{ type: Date, default: Date.now },
	monto_salida: 					{ type: Number },
	monto_total:					{ type: Number },
	monto_cambio:					{ type: Number },
	concepto:						{ type: String },
	descripcion:					{ type: String },
	comentario:						{ type: String },
	estado: 						{ type: String },
	
	factura: {
		_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Factura' },
		folio_factura: 				{ type: String },
	},

	oficina: {
		_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Oficina' },
		nombre: 				{ type: String },
	},
	
	usuario: {
		_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
		usuario: 					{ type: String },
		nombre: 					{ type: String },
		fecha:						{ type: Date, default: Date.now },
	},

	usuario_modifico: {
		_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
		usuario: 					{ type: String },
		nombre: 					{ type: String },
		fecha:						{ type: Date },
	},

}, {
	toObject: {
		virtuals: true
	},
	toJSON: {
		virtuals: true 
	}
});

EgresoSchema.index({ folio: 1, anio: 1 }, { unique: true });

EgresoSchema.virtual('folio_egreso').get(function () {
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

//EgresoSchema.plugin(autoIncrement.plugin, { model: 'Egreso', field: 'folio', startAt: 1 });
EgresoSchema.plugin(AutoIncrement, {id: 'folio_egreso', inc_field: 'folio', reference_fields: 'anio' });

module.exports = mongoose.model('Egreso', EgresoSchema);