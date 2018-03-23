var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	//autoIncrement  = require('mongoose-auto-increment'),
	AutoIncrement = require('mongoose-sequence'),
	User = mongoose.model('User'),
	Oficina = mongoose.model('Oficina'),
	Programa = mongoose.model('Programa'),
	Proveedor = mongoose.model('Proveedor'),
	Ficha = mongoose.model('Ficha')
	;


var FacturaSchema = new Schema({
	folio:							{ type: Number },
	anio:							{ type: Number },
	fecha_alta:						{ type: Date, default: Date.now },
	monto_total:					{ type: Number },
	concepto:						{ type: String },
	comentario:						{ type: String },
	//### PARA MI YO DEL FUTURO: 
	//### Decidí comentar estos dos campos, debido a que cuando se crea una factura, esta se esta pagando 
	//### al momento, por lo tanto el campo pagado seria siempre 'Si' y la fecha de pago se podria
	//### considerar la misma que la fecha de alta, considera este comentario si en el futuro (tu tiempo actual)
	//### decides descomentar estos campos
	//pagado:						{ type: String },
	//fecha_pago: 					{ type: Date },
	estado: 						{ type: String },

	usuario: {
		_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
		usuario: 					{ type: String },
		nombre: 					{ type: String },
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

	proveedor: {
		_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Proveedor' },
		nombre: 			{ type: String },
	},

	programas: [
		{
			ficha: { type: mongoose.Schema.Types.ObjectId, ref: 'Ficha' },
			folio_ficha: 			{ type: String },
			programa: { type: mongoose.Schema.Types.ObjectId, ref: 'Programa' },
			index: 					{ type: Number },
			//AGREGADos para no tener que buscar los campos siempre y porque se perdian al camcelar la factura
			nombre: 				{ type: String },
			precio: 				{ type: Number },
			descuento: 				{ type: Number },
			total: 					{ type: Number },
			monto_apoyo_terceros: 	{ type: Number },
			monto_suciqroo: 		{ type: Number },
			tiene_descuento: 		{ type: String },
			cortesia: 				{ type: String },
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

FacturaSchema.index({ folio: 1, anio: 1 }, { unique: true });

FacturaSchema.virtual('folio_factura').get(function () {
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

//FacturaSchema.plugin(autoIncrement.plugin, { model: 'Factura', field: 'folio', startAt: 1 });
FacturaSchema.plugin(AutoIncrement, {id: 'folio_factura', inc_field: 'folio', reference_fields: 'anio' });

module.exports = mongoose.model('Factura', FacturaSchema);