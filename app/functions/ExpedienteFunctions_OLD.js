
	var Expediente = require('../models/Expediente.js');
	//var Cita = require('./models/Cita.js');

  	//GET - Return all expedientes in the DB
  	findAllExpedientes = function(req, res) {
  		Expediente.find(function(err, expedientes) {
  			if(!err) {
        		console.log('GET /expedientes');
  				res.json(expedientes); //Atencion AQUI en la forma de enviar los resultlados
  			} else {
  				console.log('ERROR: ' + err);
  				res.status(500).send(err);
  			}
  		});
  	};

  	
  	//GET - Return all expedientes in the DB with search data
  	searchExpedientes = function(req, res) {
  		//console.log(req.body.data);
  		req.body.data = req.body.data.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&"); //To escape special characters
  		//console.log(req.body.data);
  		Expediente.find(
  			//Tipe of operator and fields with values $regex = like, $options:"i" = insensitive
  			{ $or: [
  				{apPaterno: { $regex : req.body.data, $options:"i" } },
  				{apMaterno: { $regex : req.body.data, $options:"i" } },
  				{nombre: 	{ $regex : req.body.data, $options:"i" } },
  				{telefono: 	{ $regex : req.body.data, $options:"i" } },
  				{email: 	{ $regex : req.body.data, $options:"i" } }
  				]
  			}, 
  			function(err, expedientes) {
	  			if(!err) {
	        		//console.log('GET /expedientes search');
	  				res.json(expedientes); //Atencion AQUI en la forma de enviar los resultlados
	  			} else {
	  				console.log('ERROR: ' + err);
	  				res.status(500).send(err);
	  			}
  			}
  		);
  	};
  	

	//GET - Return a Expediente with specified ID
	findByIdExpediente = function(req, res) {
		Expediente.findById(req.params.id, function(err, expediente) {
			if(!err) {
	    		console.log('GET /expediente/' + req.params.id);
				res.json(expediente);
			} else {
				console.log('ERROR: ' + err);
				res.status(500).send(err);
			}
		});
	};

	//POST - Insert a new Expediente in the DB
	addExpediente = function(req, res) {
		console.log('POST');
		console.log(req.body);

		var expediente = new Expediente({
				apPaterno:							req.body.apPaterno,
				apMaterno:							req.body.apMaterno,
				nombre:								req.body.nombre,
				telefono:							req.body.telefono,
				email:								req.body.email,
				edad: 								req.body.edad,							
				sexo:								req.body.sexo,
				peso:								req.body.peso,
				talla:								req.body.talla,
				ta:									req.body.ta,
				pulso:								req.body.pulso,
				lugar_nacimiento:					req.body.lugar_nacimiento,
				fecha_nacimiento:					req.body.fecha_nacimiento,
				estado_civil:						req.body.estado_civil,
				escolaridad:						req.body.escolaridad,
				religion:							req.body.religion,
				sedentarismo:						req.body.sedentarismo,
				tipo_relaciones_sexuales:			req.body.tipo_relaciones_sexuales,
				parejas_sexuales:					req.body.parejas_sexuales,
				alimentacion:						req.body.alimentacion,
				habitacion: 						req.body.habitacion,
				higiene: 							req.body.higiene,
				ocupacion: 							req.body.ocupacion,
				tabaquismo: 						req.body.tabaquismo,
				alcoholismo: 						req.body.alcoholismo,
				quirurgicos: 						req.body.quirurgicos,
				traumaticos: 						req.body.traumaticos,
				alergicos: 							req.body.alergicos,
				transfusion: 						req.body.transfusion,
				enfermedades_infecto_contagiosas:	req.body.enfermedades_infecto_contagiosas,
				diabeticos: 						req.body.diabeticos,
				oncologicos: 						req.body.oncologicos,
				congenitos: 						req.body.congenitos,
				enfermedades_degenerativas: 		req.body.enfermedades_degenerativas,
				otros_hereditarios: 				req.body.otros_hereditarios,
				menarca: 							req.body.menarca,
				ritmo: 								req.body.ritmo,
				ivsa: 								req.body.ivsa,
				fur: 								req.body.fur,
				epe: 								req.body.epe,
				embarazos: 							req.body.embarazos,
				partos: 							req.body.partos,
				abortos: 							req.body.abortos,
				cesareas: 							req.body.cesareas,
				mpf: 								req.body.mpf,
				lactancia: 							req.body.lactancia,
				fue: 								req.body.fue,
				numero_hijos: 						req.body.numero_hijos,
				estado: 							req.body.estado
		});

		expediente.save(function(err) {
			if(!err) {
				console.log('Created');
				res.json(expediente);
			} else {
				console.log('ERROR: ' + err);
				res.status(500).send(err);
			}
		});
	};

	//PUT - Update a register already exists
	updateExpediente = function(req, res) {
		Expediente.findById(req.params.id, function(err, expediente) {
			//expediente.nombre   = req.body.petId;
			//expediente.apPaterno    = req.body.apPaterno;
			//expediente.apMaterno = req.body.apMaterno;
			//expediente.edad  = req.body.edad
			//expediente.estado_civil = req.body.estado_civil;
			expediente.apPaterno=							req.body.apPaterno;
			expediente.apMaterno=							req.body.apMaterno;
			expediente.nombre=								req.body.nombre;
			expediente.telefono=							req.body.telefono;
			expediente.email=								req.body.email;
			expediente.edad= 								req.body.edad;							
			expediente.sexo=								req.body.sexo;
			expediente.peso=								req.body.peso;
			expediente.talla=								req.body.talla;
			expediente.ta=									req.body.ta;
			expediente.pulso=								req.body.pulso;
			expediente.lugar_nacimiento=					req.body.lugar_nacimiento;
			expediente.fecha_nacimiento=					req.body.fecha_nacimiento;
			expediente.estado_civil=						req.body.estado_civil;
			expediente.escolaridad=						req.body.escolaridad;
			expediente.religion=							req.body.religion;
			expediente.sedentarismo=						req.body.sedentarismo;
			expediente.tipo_relaciones_sexuales=			req.body.tipo_relaciones_sexuales;
			expediente.parejas_sexuales=					req.body.parejas_sexuales;
			expediente.alimentacion=						req.body.alimentacion;
			expediente.habitacion= 						req.body.habitacion;
			expediente.higiene= 							req.body.higiene;
			expediente.ocupacion= 							req.body.ocupacion;
			expediente.tabaquismo= 						req.body.tabaquismo;
			expediente.alcoholismo= 						req.body.alcoholismo;
			expediente.quirurgicos= 						req.body.quirurgicos;
			expediente.traumaticos= 						req.body.traumaticos;
			expediente.alergicos= 							req.body.alergicos;
			expediente.transfusion= 						req.body.transfusion;
			expediente.enfermedades_infecto_contagiosas=	req.body.enfermedades_infecto_contagiosas;
			expediente.diabeticos= 						req.body.diabeticos;
			expediente.oncologicos= 						req.body.oncologicos;
			expediente.congenitos= 						req.body.congenitos;
			expediente.enfermedades_degenerativas= 		req.body.enfermedades_degenerativas;
			expediente.otros_hereditarios= 				req.body.otros_hereditarios;
			expediente.menarca= 							req.body.menarca;
			expediente.ritmo= 								req.body.ritmo;
			expediente.ivsa= 								req.body.ivsa;
			expediente.fur= 								req.body.fur;
			expediente.epe= 								req.body.epe;
			expediente.embarazos= 							req.body.embarazos;
			expediente.partos= 							req.body.partos;
			expediente.abortos= 							req.body.abortos;
			expediente.cesareas= 							req.body.cesareas;
			expediente.mpf= 								req.body.mpf;
			expediente.lactancia= 							req.body.lactancia;
			expediente.fue= 								req.body.fue;
			expediente.numero_hijos= 						req.body.numero_hijos;
			expediente.estado= 							req.body.estado

			expediente.save(function(err) {
				if(!err) {
					console.log('Updated');
					res.json(expediente);
				} else {
					console.log('ERROR: ' + err);
					res.status(500).send(err);
				}
			});
		});
	}

	//DELETE - Delete a Expediente with specified ID
	deleteExpediente = function(req, res) {
		Expediente.findById(req.params.id, function(err, expediente) {
			expediente.remove(function(err) {
				if(!err) {
					console.log('Removed');
				} else {
					console.log('ERROR: ' + err);
					res.status(500).send(err);
				}
			})
		});
	}