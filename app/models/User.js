var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	Oficina = mongoose.model('Oficina'),
	Rol = mongoose.model('Rol');
	
var UserSchema = new Schema({
	usuario: 							{ type: String, unique: true, lowercase: true },
	password: 							{ type: String },
	token: 								{ type: String },
	titulo: 							{ type: String },
	siglas: 							{ type: String },
	apPaterno:							{ type: String },
	apMaterno:							{ type: String },
	nombre:								{ type: String },
	telefono:							{ type: String },
	email:								{ type: String },
    fecha_alta: 						{ type: Date, default: Date.now },
    estado: 							{ type: String },
    
    oficina: 							{ type: mongoose.Schema.Types.ObjectId, ref: 'Oficina' },
    rol: 								{ type: mongoose.Schema.Types.ObjectId, ref: 'Rol' }
    
}, {
	toObject: {
		virtuals: true
	},
	toJSON: {
		virtuals: true 
	}
});

UserSchema.virtual('nombre_completo').get(function () {
	return this.nombre + ' ' + this.apPaterno + ' ' + this.apMaterno;
});

UserSchema.index({ nombre: 1, apPaterno: 1, apMaterno: 1}, { unique: true });

module.exports = mongoose.model('User', UserSchema);