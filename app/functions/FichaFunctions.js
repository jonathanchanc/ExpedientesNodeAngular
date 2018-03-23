	var Instance = require('../models/Ficha.js');
	var Factura = require('../models/Factura.js');

  	//POST - Return all rows by query
  	queryFicha = function(req, res) {
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
	findByIdFicha = function(req, res) {
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
	addFicha = function(req, res) {
		var instance = {};
		//instance.folio = req.body.folio;
		instance.anio = req.body.anio;
		instance.monto_total = req.body.monto_total;				
		instance.comentario = req.body.comentario;
		instance.pagado = req.body.pagado;
		instance.pagado_parcialmente = req.body.pagado_parcialmente;
		instance.estado = req.body.estado;
		//Campos objeto
		instance.cliente = req.body.cliente;
		instance.usuario = req.body.usuario;
		instance.programas = req.body.programas;
		//No considerados al crear
		//instance.usuario = req.body.usuario_modifico;
		//instance.fecha_alta = req.body.fecha_alta; //Automatico
		//instance.fecha_pago = req.body.fecha_pago; 
		//instance.fecha_ultima_modificacion = req.body.fecha_ultima_modificacion;

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
	updateFicha = function(req, res) {
		Instance.findByIdAndUpdate(req.params.id, { $set: req.body }, {new: true}, function(err, instance) {
			if(!err) {
				console.log('Updated');
				res.json(instance);
			} else {
				console.log('ERROR: ' + err);
				res.status(500).send(err);
			}
		});
	}

	//PUT - Update a register already exists
	updateFicha_old = function(req, res) {
		Instance.findById(req.params.id, function(err, instance) {
			//instance.folio = req.body.folio;
			//instance.anio = req.body.anio;
			instance.monto_total = req.body.monto_total;				
			instance.comentario = req.body.comentario;
			instance.pagado = req.body.pagado;
			instance.pagado_parcialmente = req.body.pagado_parcialmente;
			instance.fecha_pago = req.body.fecha_pago;
			instance.estado = req.body.estado;
			//Campos objeto
			instance.cliente = req.body.cliente;
			instance.usuario = req.body.usuario;
			instance.usuario_modifico = req.body.usuario_modifico;
			instance.programas = req.body.programas;
			//No considerados al crear
			//instance.fecha_alta = req.body.fecha_alta; //Automatico
			//instance.fecha_pago = req.body.fecha_pago; 
			//instance.fecha_ultima_modificacion = req.body.fecha_ultima_modificacion;

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
	deleteFicha = function(req, res) {
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