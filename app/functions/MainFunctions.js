	var jwt	 = require('jsonwebtoken');
	var User = require('../models/User.js');
	var Rol = require('../models/Rol.js');
	var Privilegio = require('../models/Privilegio.js');
	var Oficina = require('../models/Oficina.js');
	var _  = require('underscore');

  	//GET - Return all expedientes in the DB
  	authenticate = function(req, res) {
  		User.findOne({usuario: req.body.usuario, password: req.body.password}, function(err, user) {
	        if (err) {
	            res.json({
	                type: false,
	                data: "Error occured: " + err
	            });
	        } else {
	            if (user) {
	               res.json({
	                    type: true,
	                    data: user,
	                    token: user.token
	                }); 
	            } else {
	                res.json({
	                    type: false,
	                    data: "Incorrect usuario/password"
	                });    
	            }
	        }
	    });
  	};

	// //GET - Return a Expediente with specified ID
	// signin = function(req, res) {
	//     User.findOne({usuario: req.body.usuario /*, password: req.body.password */}, function(err, user) {
	//         if (err) {
	//             res.json({
	//                 type: false,
	//                 data: "Error occured: " + err
	//             });
	//         } else {
	//             if (user) {
	//                 res.json({
	//                     type: false,
	//                     data: "User already exists!"
	//                 });
	//                 console.log("Usuario existe");
	//             } else {
	//                 var userModel = new User();
	//                 userModel.usuario = req.body.usuario;
	//                 userModel.password = req.body.password;
	//                 userModel.save(function(err, user) {
	//                     user.token = jwt.sign(user, /*process.env.JWT_SECRET ||*/ 'randomkey');
	//                     user.save(function(err, user1) {
	//                         res.json({
	//                             type: true,
	//                             data: user1,
	//                             token: user1.token
	//                         });
	//                     });
	//                 });
	// 				console.log("Usuario guardado");
	//             }
	//         }
	//     });
	// };

	//POST - Insert a new Expediente in the DB
	me = function(req, res) {
		User.findOne({token: req.token}, function(err, user) {
	        if (err) {
	            res.json({
	                type: false,
	                data: "Error occured: " + err
	            });
	        } else {
	            res.json({
	                type: true,
	                data: user
	            });
	        }
	    });
		
	};

	ensureAuthorized = function(req, res, next) {
	    var bearerToken;
	    var bearerHeader = req.headers["authorization"];
	    if (typeof bearerHeader !== 'undefined') {
	        var bearer = bearerHeader.split(" ");
	        bearerToken = bearer[1];
	        req.token = bearerToken;
	        //console.log(req);
	        //console.log(req.parsedUrl);
	        //console.log(res);

	        //PARA VALIDAR URL
	        //console.log('originalUrl '+req.originalUrl);
	        //console.log(req.route);
	        next();
	    } else {
	        res.send(403);
	    }
	}

	getPrivilegios = function(req, res) {
		User.findOne({token: req.token}, function(err, userInstance) {
			if(!err) {
				Rol.findById(userInstance.rol, function(err, rolInstance) {
					if(!err) {
						var arrQ = { 
								$and: [ 
									{ estado: 'Activo' },
									{ _id: { $in: rolInstance.privilegios } },
								]
							}; ///Verificar que este activos los privilegios
						var query = Privilegio.find(arrQ);
						query.exec(function(err, privilegioInstance) {
							var data = {
								usuario: userInstance,
								privilegios: privilegioInstance
							}
					  		//res.json(privilegioInstance);
					  		res.json(data);
				        });
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
	}

	//GET - Return a Expediente with specified ID
	inicializar = function(req, res) {

		//Buscamos el usuario en la BD
	    User.findOne({usuario: 'admin2' }, function(err, user) {
	        if (err) {
	            res.sendfile('./public/index.html');
	            console.log('ERROR: ' + err);
	        } else { //Si existe no insetamos registros
	            if (user) {
	                res.sendfile('./public/index.html');
	                console.log("Usuario existe");
	            } else {

	            	/*privilegios = [
						{ id: 2100, nombre: 'Test', modulo: 'Seguridad', descripcion: 'Menu',estado: 'Activo', } ,
						{ id: 2110, nombre: 'test-lista', modulo: 'Seguridad', descripcion: 'Lista',estado: 'Activo', } ,
						{ id: 120, nombre: 'privilegios-busqueda', modulo: 'Seguridad', descripcion: 'Busqueda',estado: 'Activo', } ,
						{ id: 130, nombre: 'privilegios-crear', modulo: 'Seguridad', descripcion: 'Crear',estado: 'Activo', } ,
						{ id: 140, nombre: 'privilegios-editar', modulo: 'Seguridad', descripcion: 'Editar',estado: 'Activo', } ,
						{ id: 150, nombre: 'privilegios-estado', modulo: 'Seguridad', descripcion: 'Estado',estado: 'Activo', } ,

						{ id: 200, nombre: 'Roles', modulo: 'Seguridad', descripcion: 'Menu',estado: 'Activo', } ,
						{ id: 210, nombre: 'roles-lista', modulo: 'Seguridad', descripcion: 'Lista',estado: 'Activo', } ,
						{ id: 220, nombre: 'roles-busqueda', modulo: 'Seguridad', descripcion: 'Busqueda',estado: 'Activo', } ,
						{ id: 230, nombre: 'roles-crear', modulo: 'Seguridad', descripcion: 'Crear',estado: 'Activo', } ,
						{ id: 240, nombre: 'roles-editar', modulo: 'Seguridad', descripcion: 'Editar',estado: 'Activo', } ,
						{ id: 250, nombre: 'roles-estado', modulo: 'Seguridad', descripcion: 'Estado',estado: 'Activo', } ,

						{ id: 300, nombre: 'Usuarios', modulo: 'Seguridad', descripcion: 'Menu',estado: 'Activo', } ,
						{ id: 310, nombre: 'users-lista', modulo: 'Seguridad', descripcion: 'Lista',estado: 'Activo', } ,
						{ id: 320, nombre: 'users-busqueda', modulo: 'Seguridad', descripcion: 'Busqueda',estado: 'Activo', } ,
						{ id: 330, nombre: 'users-crear', modulo: 'Seguridad', descripcion: 'Crear',estado: 'Activo', } ,
						{ id: 340, nombre: 'users-editar', modulo: 'Seguridad', descripcion: 'Editar',estado: 'Activo', } ,
						{ id: 350, nombre: 'users-estado', modulo: 'Seguridad', descripcion: 'Estado',estado: 'Activo', } ,
					];

					//Insertamos Privilegios
					var privRol = [];
					_.each(privilegios, function(p){
						var priv = p;
						priv = new Privilegio(priv);
						priv.save(function(err) {
							if(!err) {
								console.log('Created');
								console.log(priv);
								console.log(priv._id);
								privRol.push(priv._id);
							}
							else
								console.log('ERROR: ' + err);
						});
					});

					//Insertamos Rol
					var idRol = '';
					var rol = { nombre: 'TestRol', descripcion: 'Rol', homepage: 'Rol', privilegios: privRol, estado: 'Activo', };
					rol = new Rol(rol);
					rol.save(function(err) {
						if(!err) {
							console.log('Created');
							idRol = rol._id; 
						}
						else
							console.log('ERROR: ' + err);
					});

					//Insertamos Rol
					var idOficina = '';
					var oficina = { nombre: 'Oficina Test', direccion: 'Test', estado: 'Activo', };
					oficina = new Oficina(oficina);
					oficina.save(function(err) {
						if(!err) {
							console.log('Created');
							idOficina = oficina._id; 
						}
						else
							console.log('ERROR: ' + err);
					});*/

	            	//Insertamos Usuario
	                var userModel = new User();
	                userModel.usuario = 'sudo';
	                userModel.password = 'superUserDo';
	                //userModel.rol = idRol;
	                //userModel.oficina = idOficina;
	                userModel.token = undefined;
	                userModel.save(function(err, newUser) {
	                    newUser.token = jwt.sign(newUser, /*process.env.JWT_SECRET ||*/ 'randomkey');
	                    newUser.save(function(err, user1) {
	                        /*res.json({
	                            type: true,
	                            data: user1,
	                            token: user1.token
	                        });*/
	                    	res.sendfile('./public/index.html');
	                    });
	                });
					console.log("Usuario guardado");
	            }
	        }
	    });
	};