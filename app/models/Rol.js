var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	Privilegio = mongoose.model('Privilegio');

var RolSchema = new Schema({
	nombre:								{ type: String, unique: true },
	descripcion:						{ type: String },
	homepage:							{ type: String },
	estado: 							{ type: String },

	privilegios : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Privilegio' }]
});

module.exports = mongoose.model('Rol', RolSchema);