	var Instance = require('../models/Privilegio.js');

  	//POST - Return all rows by query
  	queryPrivilegio = function(req, res) {
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
	findByIdPrivilegio = function(req, res) {
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
	addPrivilegio = function(req, res) {
		var instance = {};
		instance.id = req.body.id;
		instance.nombre = req.body.nombre;
		instance.modulo = req.body.modulo;
		instance.descripcion = req.body.descripcion;
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
	updatePrivilegio = function(req, res) {
		Instance.findById(req.params.id, function(err, instance) {
			instance.id = req.body.id;
			instance.nombre = req.body.nombre;
			instance.modulo = req.body.modulo;
			instance.descripcion = req.body.descripcion;
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
	deletePrivilegio = function(req, res) {
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
  	queryPrivilegios = function(req, res) {
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
		        		console.log('GET /queryPrivilegios');
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
