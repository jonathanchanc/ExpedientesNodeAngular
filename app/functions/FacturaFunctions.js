	var Instance = require('../models/Factura.js');
	var Ficha = require('../models/Ficha.js');
	var Egreso = require('../models/Egreso.js');
	var _  = require('underscore');

  	//POST - Return all rows by query
  	queryFactura = function(req, res) {
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
	findByIdFactura = function(req, res) {
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
	addFactura = function(req, res) {
		var instance = {};
		//instance.folio = req.body.folio;
		/*instance.anio = req.body.anio;
		instance.monto_total = req.body.monto_total;				
		instance.comentario = req.body.comentario;
		instance.concepto = req.body.concepto;
		instance.pagado = req.body.pagado;
		instance.fecha_pago = req.body.fecha_pago;
		instance.estado = req.body.estado;
		//Campos objeto
		instance.usuario = req.body.usuario;
		instance.proveedor = req.body.proveedor;
		instance.programas = req.body.programas;
		*/
		//No considerados al crear
		//instance.usuario = req.body.usuario_modifico;
		//instance.fecha_alta = req.body.fecha_alta; //Automatico
		//instance.fecha_pago = req.body.fecha_pago; 
		//instance.fecha_ultima_modificacion = req.body.fecha_ultima_modificacion;
		instance = req.body;

		instance = new Instance(instance);
		instance.save(function(err) {
			if(!err) {
				console.log('Created factura');
				console.log(instance);
				//res.json(instance);
				//Una vez gauardado la factura, guardamos el egreso
				var egreso = {
								anio: new Date().getFullYear(),
								monto_salida: instance.monto_total,
								monto_total: instance.monto_total,
								monto_cambio: 0,
								concepto: 'Pago de Factura: '+instance.folio_factura,
								comentario: 'Registro agregado automaticamente por el sistema',
								estado: 'Activo',
								factura: {
									_id: instance._id,
									folio_factura: instance.folio_factura,
								},
								oficina: {
									_id: instance.usuario.oficina._id,
									nombre: instance.usuario.oficina.nombre,
								},
								usuario: {
									_id: instance.usuario._id,
									usuario: instance.usuario.usuario,
									nombre: instance.usuario.nombre,
									fecha: instance.usuario.fecha,
								},
							};
				egreso = new Egreso(egreso);
				console.log(egreso);
				egreso.save(function(err) {
					if(!err) {
						console.log('Created egreso');
						console.log(egreso);
						res.json(instance);
					} else {
						console.log('ERROR: ' + err);
						res.status(500).send(err);
					}
				});
			} else {
				console.log('ERROR: ' + err);
				res.status(500).send(err);
			}
		});
	};

	//PUT - Update a register already exists
	updateFactura = function(req, res) {
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

	updateFichasProgramas = function(req, res) {
		//PAGAR SERVICIOS DE FICHA (ACTUALIZAR PROGRAMAS)
		//console.log(req.body);
		//Iteramos con la libreria underscore
		var arrFichaIds = [];
		_.each(req.body, function(ficha){
			//console.log(ficha.query);
			// Llamamos metodo findOneAndUpdate
			//console.log(ficha.query.$and[0]._id);
			arrFichaIds.push(ficha.query.$and[0]._id); //El id será usado más adelante
			Ficha.findOneAndUpdate(ficha.query, ficha.data, {new: true}, function(err, instance) {
				if(err) {
					console.log('ERROR: ' + err);
					res.status(500).send(error);
				}
			});
		});

		/* ACTUALIZAR FUNCIONAL OLD
		for(i = 0; i < req.body.length; ++i){
			var ficha = req.body[i];
			console.log(ficha.query);
			Ficha.findOneAndUpdate(ficha.query, ficha.data, {new: true}, function(err, instance) {
				if(err) {
					console.log('ERROR: ' + err);
					res.status(500).send(error);
				}
			});
		}*/
			

		//VERIFICAR FICHA TOTAL O PARCIALMENTE PAGADA
		// 1. Extraemos los ids de ficha a partir de la propiedad _id
		//console.log(req.body);
        //var fichas = _.pluck(req.body, '_id');
        //console.log(arrFichaIds);
        // 2. Quitamos ids repetidos
        arrFichaIds = _.uniq(arrFichaIds);
        //console.log(arrFichaIds);
        // 3. Iteramos la lista y buscamos el archivo con mongoose
        _.each(arrFichaIds, function(fichaId){		
			// Llamamos metodo findById
			//console.log(fichaId);
			Ficha.findById(fichaId, function(err, instance) {
				if(!err) {
					//Si encontramos ficha, iteramos sus programas y contamos cuantos estan pagados
					var countPagados = 0;
					//console.log(instance);
					_.each(instance.programas, function(programa){
						if(programa.pagado == 'Si')
							countPagados++;
					});
					//Si el total de pagagos es igual al total de programas de la ficha, guardamos la ficha como pagada
					instance.pagado = (instance.programas.length == countPagados) ? 'Si' : 'No'; 
					instance.fecha_pago = (instance.programas.length == countPagados) ? new Date() : undefined;
					instance.pagado_parcialmente = (countPagados == 0 || instance.programas.length == countPagados) ? 'No' : 'Si';
					instance.save(function(err) {
						if(err) {
							console.log('ERROR: ' + err);
							res.status(500).send(err);
						}
					});
				} else {
					console.log('ERROR: ' + err);
					res.status(500).send(error);
				}
			});
		});

		console.log('Updated Fichas Programas');
		console.log('Updated Fichas Pago');
		res.json({status: 'OK'});		
	}

	updateEgresoByFactura = function(req, res) {
		//Cancelar Egreso al cancelar factura
		//Este metodo tambien puede ser usado para actualizar otros campos del egreso
		console.log(req.body);
		Egreso.findOneAndUpdate(req.body.query, req.body.data, {new: true}, function(err, instance) {
			if(err) {
				console.log('ERROR: ' + err);
				res.status(500).send(error);
			}
		});
		console.log('Updated Egreso');
		res.json({status: 'OK'});		
	}

	//DELETE - Delete a instance with specified ID
	deleteFactura = function(req, res) {
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