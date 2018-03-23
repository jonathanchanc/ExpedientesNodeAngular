	var Instance = require('../models/Cliente.js');

  	//POST - Return all rows by query
  	queryCliente = function(req, res) {
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
	findByIdCliente = function(req, res) {
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
	addCliente = function(req, res) {
		var instance = {};
		instance.apPaterno = req.body.apPaterno;
		instance.apMaterno = req.body.apMaterno;
		instance.nombre = req.body.nombre;
		instance.telefono = req.body.telefono;
		instance.direccion = req.body.direccion;
		instance.email = req.body.email;
		instance.fecha_alta = req.body.fecha_alta;
		instance.afiliado = req.body.afiliado;
		instance.credencial = req.body.credencial;
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
	updateCliente = function(req, res) {
		Instance.findById(req.params.id, function(err, instance) {
			instance.apPaterno = req.body.apPaterno;
			instance.apMaterno = req.body.apMaterno;
			instance.nombre = req.body.nombre;
			instance.telefono = req.body.telefono;
			instance.direccion = req.body.direccion;
			instance.email = req.body.email;
			instance.fecha_alta = req.body.fecha_alta;
			instance.afiliado = req.body.afiliado;
			instance.credencial = req.body.credencial;
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
	deleteCliente = function(req, res) {
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