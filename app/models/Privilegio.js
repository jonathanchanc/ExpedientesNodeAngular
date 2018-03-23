var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var PrivilegioSchema = new Schema({
	id:									{ type: Number, unique: true },
	nombre:								{ type: String, unique: true },
	modulo:								{ type: String },
	descripcion:						{ type: String },
	estado: 							{ type: String }
});

module.exports = mongoose.model('Privilegio', PrivilegioSchema);