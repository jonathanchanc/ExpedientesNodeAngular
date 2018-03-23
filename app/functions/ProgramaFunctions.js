	var Instance = require('../models/Programa.js');

  	//POST - Return all rows by query
  	queryPrograma = function(req, res) {
  		var query = Instance.find(req.body.query); 					//Array

  		if(req.body.select)
			query.select(req.body.select);							//Array || String
  			
		if(req.body.limit)
			query.limit(req.body.limit); 							//Number

    	if(req.body.limit && req.body.page)
			query.skip(req.body.limit * req.body.page);				//Number

    	if(req.body.sort)
			query.sort(req.body.sort);								//Array	|| String
  			
		query.exec(function(err, instanceList) {
				Instance.count(req.body.query).exec(function(err, count) {
					if(!err) {
	        		//console.log('POST - query');
	  				res.json({
	  					instanceList: instanceList,
	  					totalItems: count 
		            });

	  			} else {
	  				console.log('ERROR: ' + err);
	  				res.status(500).send(err);
	  			}
	            
	        });
  			
  		});
  	};
  	

	//GET - Return a instance with specified ID
	findByIdPrograma = function(req, res) {
		Instance.findById(req.params.id, function(err, instance) {
			if(!err) {
	    		//console.log('GET /' + req.params.id);
				res.json(instance);
			} else {
				console.log('ERROR: ' + err);
				res.status(500).send(err);
			}
		});
	};

	//POST - Insert a new row in the DB
	addPrograma = function(req, res) {
		var instance = {};
		instance.nombre = req.body.nombre;
		instance.descripcion = req.body.descripcion;
		instance.precio_publico = req.body.precio_publico;
		instance.precio_suciqroo = req.body.precio_suciqroo;
		instance.monto_apoyo_terceros = req.body.monto_apoyo_terceros;
		//instance.monto_suciqroo = req.body.monto_suciqroo;
		instance.especialidad = req.body.especialidad;
		instance.usuario = req.body.usuario;
		instance.estado = req.body.estado;

		instance = new Instance(instance);
		instance.save(function(err) {
			if(!err) {
				//console.log('Created');
				res.json(instance);
			} else {
				console.log('ERROR: ' + err);
				res.status(500).send(err);
			}
		});
	};

	//PUT - Update a register already exists
	updatePrograma = function(req, res) {
		Instance.findById(req.params.id, function(err, instance) {
			instance.nombre = req.body.nombre;
			instance.descripcion = req.body.descripcion;
			instance.precio_publico = req.body.precio_publico;
			instance.precio_suciqroo = req.body.precio_suciqroo;
			instance.monto_apoyo_terceros = req.body.monto_apoyo_terceros;
			//instance.monto_suciqroo = req.body.monto_suciqroo;
			instance.especialidad = req.body.especialidad;
			instance.usuario = req.body.usuario;
			instance.estado = req.body.estado;

			instance.save(function(err) {
				if(!err) {
					//console.log('Updated');
					res.json(instance);
				} else {
					console.log('ERROR: ' + err);
					res.status(500).send(err);
				}
			});
		});
	}

	//DELETE - Delete a instance with specified ID
	deletePrograma = function(req, res) {
		Instance.findById(req.params.id, function(err, instance) {
			instance.remove(function(err) {
				if(!err) {
					console.log('Removed');
				} else {
					console.log('ERROR: ' + err);
					res.status(500).send(err);
				}
			})
		});
	}


	/* ESTA REVISION FUNCIONA BIEN - OLD OLD OLD
  	//GET 2.0 - Return all rows by query
  	queryProgramas = function(req, res) {
  		console.log(req.body);
  		Instance
  			//.select(req.body.select)					//Array || String
  			.find(req.body.query) 						//Array
  			.limit(req.body.limit) 						//Number
    		.skip(req.body.limit * req.body.page)		//Number
    		.sort(req.body.sort)						//Array	|| String
  			.exec(function(err, privilegios) {

  				Instance.count(req.body.query).exec(function(err, count) {
  					if(!err) {
		        		console.log('GET /queryProgramas');
		  				//res.json(privilegios); 
		  				res.json({
		  					instanceList: privilegios,
		  					totalItems: count 
			            });

		  			} else {
		  				console.log('ERROR: ' + err);
		  				res.status(500).send(err);
		  			}
		            
		        });
	  			
	  		});
  	};*/
