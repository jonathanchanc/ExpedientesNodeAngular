angular.module('FichaCtrl',[])

	.controller('FichaController', ['$rootScope','$scope','$routeParams','$location','Main','Fichas','Users','Oficinas','Especialidades','Programas','Proveedores','Clientes','Reportes', function($rootScope, $scope, $routeParams, $location, Main, Fichas, Users, Oficinas, Especialidades, Programas, Proveedores, Clientes, Reportes) {
		$scope.controlNameSingular = 'Ficha';
		$scope.controlNamePlural = 'Fichas';
		$scope.controllerInstance = 'fichas';

		$scope.label = {};
		$scope.label.search = 'Buscar';
		$scope.label.searchResults = 'Resultados de la búsqueda: ';
		$scope.label.add = 'Nueva';
		$scope.label.edit = 'Editar';
		$scope.label.createOrEdit = '';
		$scope.label.save = 'Guardar';
		$scope.label.cancel = 'Cancelar';
		$scope.label.data = 'Datos';
		$scope.label.list = 'Lista';
		$scope.label.backToList = 'Click aqui para regresar a la lista';
		$scope.label.noResults = 'No se encontraron resultados';
		$scope.label.errorResults = 'Error al cargar lista';
		$scope.label.invalidDataForm = 'Rellene los datos correctamente';
		$scope.label.noFindRow = 'Registro no encontrado';
		$scope.label.createSuccess = 'Registro insertado con éxito';
		$scope.label.createFailed = 'Error al crear';
		$scope.label.updateSuccess = 'Registro actualizado con éxito';
		$scope.label.updateFailed = 'Error al actualizar';
		$scope.label.paginationShowing = 'Mostrando resultados';
		$scope.label.paginationTo = '-';
		$scope.label.paginationFrom = 'de';
		$scope.label.active = 'Activo';
		$scope.label.inactive = 'Inactivo';
		$scope.label.management = 'Administración';
		$scope.label.yes = 'Si';
		$scope.label.no = 'No';
		$scope.label.agregar = 'Agregar';
		$scope.label.delete = 'Borrar';
		$scope.label.other = '';
		$scope.label.print = 'Imprimir';
		$scope.label.back = 'Regresar';
		$scope.label.cliente = 'Cliente';
		$scope.label.busqueda = 'Busqueda';
		$scope.label.programas = 'Programas';

		$scope.messageShow = false;
		$scope.messageClass = "";
		$scope.messageText = '';
		$scope.messageAlertSuccess = 'alert-success';
		$scope.messageAlertInfo = 'alert-info';
		$scope.messageAlertWarning = 'alert-warning';
		$scope.messageAlertDanger = 'alert-danger';

		$scope.searchData = {};
		$scope.formTemp = {tiene_descuento: 'No', cortesia: 'No', usuario_modifico: { oficina: {} } };
		$scope.formData = {estado:'Activo', afiliado:'No', pagado:'No', pagado_parcialmente:'No', cliente:{afiliado:'No'}, usuario: { oficina: {} }, programas:[] };

		$scope.instanceList = [];
		//$scope.Usuarios = [];
		$scope.Especialidades = [];
		$scope.Programas = [];
		$scope.Proveedores = [];
		$scope.Clientes = [];
		
		$scope.totalItems = 0;
		$scope.currentPage = 1;
		$scope.itemsPerPage = 5;
		$scope.textPagination = '';

		$scope.modelTemp = {
			especialidad: 'Especialidad',
			programa: 'Programa',
			proveedor: 'Proveedor/Doctor',
			nombre_programa: 'Programa',
			concepto: 'Concepto',
			precio: 'Precio',
			total: 'Precio',
			tiene_descuento: 'Descuento',
			cortesia: 'Cortesia',
		}

		$scope.model = {
						//Ocultos
						id: 'ID',
						folio: 'Folio',
						fecha_alta: 'Fecha de alta',
						pagado: 'Pagado',
						fecha_pago: 'Fecha pagado',
						parcial: 'Parcial',
						pagado_parcialmente: 'Pagado parcialmente',
						estado: 'Estado',

						//Usados
						monto_total: 'Monto total',
						comentario: 'Comentario',
						cliente: {
							_id: 'Cliente',
							nombre: 'Nombre',
							apPaterno: 'Apellido Paterno',
							apMaterno: 'Apellido Materno',
							afiliado: 'Afiliado',
							credencial: 'Credencial',
							direccion: 'Dirección',
							telefono: 'Telefono',
							email: 'Email',
						},
						usuario: {
							_id: 'Usuario',
							nombre: 'Usuario',
							oficia: {
								_id: 'Oficina',
								nombre: 'Oficina',
							}
						},
						programas: {
							_id: 'Programa',
							nombre: 'Nombre programa',
							precio: 'Precio',
							descuento: 'Descuento',
							total: 'Total',
							monto_apoyo_terceros: 'Monto terceros',
							monto_suciqroo: 'Monto suciqroo',
							proveedor: 'Proveedor/Doctor',
							especialidad: 'Especialidad',
							tiene_descuento: 'Descuento',
							cortesia: 'Cortesia',
							pagado: 'Pagado',
							fecha_pago: 'Fecha pago',
						},						
					};

		$scope.inicio = function(){
			Main.getPrivilegios().then(function(){ $scope.privilegios = $rootScope.privilegios});
			$scope.pagination();
		}

		$scope.pagination = function(search){
			var query = {};
			if(search==1) //if is from "Search" button, then set $scope.currentPage = 1; for pagination of search
				$scope.currentPage = 1;
			else if(search==0) //if is from "List" button, then set $scope.searchData.data = ''; for retur to normla list
				$scope.searchData.data = '';

			//Si $scope.searchData.data no esta vacio, buscamos por ese dato
			if($scope.searchData.data != undefined && $scope.searchData.data != ''){
				$scope.searchData.active = true;
				var data = $scope.searchData.data;
				data = data.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
	  			query.query = 	{ 
	  								$and: [
	  									{ $or: [
								  				{'cliente.nombre': { $regex : data, $options:"i" } },
								  				{'cliente.apPaterno': { $regex : data, $options:"i" } },
								  				{'cliente.apMaterno': { $regex : data, $options:"i" } },
								  				] 
								  		}
	  								]

	  							
					  			};
			} else {
				$scope.searchData.active = false;
				$scope.messageShow = false;
	  			query.query = { 
			  					$and:[ 
				  						{ 
				  							$or: [ 
				  								{estado: 'Activo'}, 
				  								{estado: 'Inactivo'} 
				  								] 
				  						} 
			  						]
  								};
			}
			//Si en los privilegios no se encuentra fichas-todos se añade una condicion en el query $and
			if( !( _.contains($scope.privilegios,$scope.controllerInstance+'-todos') ) ){
				query.query['$and'].push({ 'usuario._id' : $rootScope.usuario._id })
				//console.log("No tiene el permiso")
			} //else
				//console.log("Si tiene el permiso")
			
			query.limit = $scope.itemsPerPage;
    		query.page = $scope.currentPage-1;
    		query.sort = {};
			$scope.query(query);
		}


		$scope.query = function(query){
			Fichas.query(query)
				.success(function(data) {
					$scope.instanceList = angular.copy(data.instanceList);
					$scope.totalItems = data.totalItems;
					$scope.calculateTextPagination();
					if($scope.searchData.active){
						$scope.showMessage(true, $scope.messageAlertInfo, $scope.label.searchResults+' "'+$scope.searchData.data+'"... ');
					}					
				})
				.error(function(data, status) {
					$scope.showMessage(true, $scope.messageAlertDanger, $scope.label.errorResults, status, data);
	            })
			;
		}


		$scope.calculateTextPagination = function(){
			var strFrom = ((($scope.currentPage - 1) * $scope.itemsPerPage) + 1);
			var strTo = ($scope.currentPage * $scope.itemsPerPage);
			if(strTo > $scope.totalItems || strTo == 0)
				strTo = $scope.totalItems;
			
			$scope.textPagination = 
				$scope.label.paginationShowing+' '+strFrom+' '+
				$scope.label.paginationTo +' '+strTo+' '+
				$scope.label.paginationFrom+' '+$scope.totalItems;
		}
		

		$scope.get = function(){

			//Comentar este bloque de users
			/*
			Users.query({ query: { estado: 'Activo' } })
				.success(function(data) { $scope.Usuarios = angular.copy(data.instanceList); })
				.error(function(data, status) {
					$scope.showMessage(true, $scope.messageAlertDanger, $scope.label.errorResults, status, data);
	            });
	        */
			
	        Especialidades.query({ query: { estado: 'Activo' } })
				.success(function(data) { $scope.Especialidades = angular.copy(data.instanceList); })
				.error(function(data, status) {
					$scope.showMessage(true, $scope.messageAlertDanger, $scope.label.errorResults, status, data);
	            });

			Programas.query({ query: { estado: 'Activo' } })
				.success(function(data) { $scope.Programas = angular.copy(data.instanceList); })
				.error(function(data, status) {
					$scope.showMessage(true, $scope.messageAlertDanger, $scope.label.errorResults, status, data);
	            });

	        Proveedores.query({ query: { estado: 'Activo' } })
				.success(function(data) { $scope.Proveedores = angular.copy(data.instanceList); })
				.error(function(data, status) {
					$scope.showMessage(true, $scope.messageAlertDanger, $scope.label.errorResults, status, data);
	            });

			Clientes.query({ query: { estado: 'Activo' } })
				.success(function(data) { $scope.Clientes = angular.copy(data.instanceList); })
				.error(function(data, status) {
					$scope.showMessage(true, $scope.messageAlertDanger, $scope.label.errorResults, status, data);
	            });

			Main.me(
				//).success(
				function(userData) {
					Oficinas.query({ query: { _id: userData.data.oficina } })
						.success(function(dataOficina) {

							$scope.label.createOrEdit = $scope.label.add;
							if($routeParams.instanceId != undefined){

								$scope.formTemp.statusEditable = true; //Campos de activo y usurio creo
								$scope.formTemp.noEditable = true; //Evitar poder editar cliente y programas
								if($scope.formTemp.noEditable){
									$scope.formTemp.lockCliente = true;
								}

								Fichas.findById($routeParams.instanceId)
									.success(function(dataFicha) {
										$scope._id = $routeParams.instanceId;
										$scope.formData = angular.copy(dataFicha);
										$scope.label.createOrEdit = '';
										$scope.label.other = dataFicha.folio_ficha;
										//AGregamos usuario modifico
										dataOficina = dataOficina.instanceList[0];
										$scope.formTemp.usuario_modifico._id = userData.data._id;
										$scope.formTemp.usuario_modifico.usuario = userData.data.usuario;
										$scope.formTemp.usuario_modifico.nombre = userData.data.nombre_completo;
										$scope.formTemp.usuario_modifico.oficina._id = dataOficina._id;
										$scope.formTemp.usuario_modifico.oficina.nombre = dataOficina.nombre;
										//$scope.formData.usuario_modifico = $scope.formTemp.usuario_modifico;
									})
									.error(function(dataFicha, status) {
										console.log($scope.label.noFindRow);
										$location.path('/'+$scope.controllerInstance);
						            })
									;
							} else {
								//$scope.Usuarios = angular.copy(userData); //Comentar esta linea tambien
								dataOficina = dataOficina.instanceList[0];
								$scope.formData.usuario._id = userData.data._id;
								$scope.formData.usuario.usuario = userData.data.usuario;
								$scope.formData.usuario.nombre = userData.data.nombre_completo;
								$scope.formData.usuario.oficina._id = dataOficina._id;
								$scope.formData.usuario.oficina.nombre = dataOficina.nombre;
							}

						})
						.error(
							function(data, status) {
							$scope.showMessage(true, $scope.messageAlertDanger, $scope.label.errorResults, status, data);
			            });
		        },
		        //).error(
					function(data, status) {
					$scope.showMessage(true, $scope.messageAlertDanger, $scope.label.errorResults, status, data);
	            });
		}


		$scope.createOrUpdate = function(isValid, _id) {
			$scope.formTemp.lockButtonSave = true;
			$scope.messageShow = false;
			$scope.messageClass = "";
			$scope.messageText = '';

			//Valida formData
			if (isValid) {
				
				if(_id != undefined) {
					$scope.formData.usuario_modifico = $scope.formTemp.usuario_modifico; //Asginamos nuevo usuario modifico
					$scope.formData.usuario_modifico.fecha = new Date(); //Fecha modificacion
					Fichas.update(_id,$scope.formData)
						.success(function(data) {
							$scope.formData = {};
							console.log($scope.label.updateSuccess);
							$location.path('/'+$scope.controllerInstance);
							//COMO ENVIAR ALERTA?							
							//$scope.messageShow = true;
							//$scope.messageClass = $scope.messageAlertSuccess;
							//$scope.messageText = $scope.label.updateSuccess;
						})
						.error(function(data, status) {
							$scope.formTemp.lockButtonSave = false;
							$scope.showMessage(true, $scope.messageAlertDanger, $scope.label.updateFailed, status, data);
			            })
						;
				} else {
					//CREAR
					if($scope.validateCliente()){ //VALIDAMOS CLIENTE
						$scope.formData.usuario.fecha = new Date(); //Fecha creacion
						$scope.formData.anio = new Date().getFullYear(); //Fecha creacion
						$scope.formData.cliente.estado = 'Activo';
						if($scope.formData.cliente._id){ //Si existe cliente - 
							//actualizamos datos cliente
							//$scope.formData.cliente.estado = 'Activo';
							Clientes.update($scope.formData.cliente._id,$scope.formData.cliente)
								.success(function(data) {
									$scope.showMessage(true, $scope.messageAlertDanger, $scope.label.updateSuccess, status, data);
								})
								.error(function(data, status) {
									$scope.formTemp.lockButtonSave = false;
									$scope.showMessage(true, $scope.messageAlertDanger, $scope.label.updateFailedFailed, status, data);
					            })
								;
							//Creamos ficha
							Fichas.create($scope.formData).success(function(data) {
									$scope.formData = {};
									console.log($scope.label.createSuccess);
									$location.path('/'+$scope.controllerInstance);
								})
								.error(function(data, status) {
									$scope.formTemp.lockButtonSave = false;
									$scope.showMessage(true, $scope.messageAlertDanger, $scope.label.createFailed, status, data);
					            })
					            ;
						} else { //Si no existe cliente - se crea cliente y despues la ficha
							//$scope.formData.cliente.estado = 'Activo';
							Clientes.create($scope.formData.cliente)
								.success(function(data) {
									$scope.formData.cliente._id = data._id;
									//Correcto - Crear Ficha
									Fichas.create($scope.formData).success(function(data) {
										$scope.formData = {};
										console.log($scope.label.createSuccess);
										$location.path('/'+$scope.controllerInstance);
									})
									.error(function(data, status) {
										$scope.formTemp.lockButtonSave = false;
										$scope.showMessage(true, $scope.messageAlertDanger, $scope.label.createFailed, status, data);
						            })
						            ;
								})
								.error(function(data, status) {
									$scope.formTemp.lockButtonSave = false;
									$scope.showMessage(true, $scope.messageAlertDanger, $scope.label.createFailed, status, data);
					            })
								;
						}
					} else {
						$scope.formTemp.lockButtonSave = false;
					}
				}
			} else {
				$scope.formTemp.lockButtonSave = false;
				$scope.showMessage(true, $scope.messageAlertDanger, $scope.label.invalidDataForm);
			}
		};

		$scope.delete = function(_id) {
			//Fichas.delete(_id);
		};

		$scope.showMessage = function(show,type,message,status,data) {
			$scope.messageShow = show;
			$scope.messageClass = type;
			$scope.messageText = message;
			if(status){
				console.log('Error: ' + status);
	        	console.log(data);	
			}
			angular.element('#alertMessage').focus();
		};

		//Funciones para llenado del formulario
		$scope.getDataCliente = function(){
			if($scope.formData.cliente._id){
				//Buscar el programa seleccionado dentro de la lista de programas para obtener datos
		        var cliente = _.find($scope.Clientes, function(cliente){ return cliente._id ==$scope.formData.cliente._id; });
		        $scope.formData.cliente.nombre = cliente.nombre;
		        $scope.formData.cliente.apPaterno = cliente.apPaterno;
		        $scope.formData.cliente.apMaterno = cliente.apMaterno;
		        $scope.formData.cliente.afiliado = cliente.afiliado;
		        $scope.formData.cliente.credencial = cliente.credencial;
		        $scope.formData.cliente.direccion = cliente.direccion;
		        $scope.formData.cliente.telefono = cliente.telefono;
		        $scope.formData.cliente.email = cliente.email;
		    }
		    //$scope.getDataPrograma();
		};

		$scope.getDataClienteByCredencial = function(){
			if($scope.formData.cliente.afiliado == 'Si' && $scope.formData.cliente.credencial){
				//Buscar el programa seleccionado dentro de la lista de programas para obtener datos
		        var cliente = _.find($scope.Clientes, function(cliente){ return cliente.credencial ==$scope.formData.cliente.credencial; });
		        if(cliente){
			        $scope.formData.cliente._id = cliente._id;
			        $scope.getDataCliente(); //Este metodo rellena todos los campos
			        $scope.showMessage(false,'','');
			    } else {
			    	$scope.showMessage(true, $scope.messageAlertInfo, $scope.label.noResults);
			    }
		    } else {
		    	$scope.showMessage(true, $scope.messageAlertWarning, 'Ingrese el numero de credencial');
		    }
		};

		$scope.getProgramasByEspecialidad = function(){
			Programas.query({ query: { especialidad: $scope.formTemp.especialidad, estado: 'Activo' } })
				.success(function(data) { 
					$scope.Programas = angular.copy(data.instanceList); 
				})
				.error(function(data, status) {
					$scope.showMessage(true, $scope.messageAlertDanger, $scope.label.errorResults, status, data);
	            });

	        Proveedores.query({ query: { especialidades: $scope.formTemp.especialidad, estado: 'Activo' } })
				.success(function(data) { 
					$scope.Proveedores = angular.copy(data.instanceList); 
				})
				.error(function(data, status) {
					$scope.showMessage(true, $scope.messageAlertDanger, $scope.label.errorResults, status, data);
	            });
		};

		$scope.getDataPrograma = function(){
			//Si es afiliado no puede hacerse un descuento
			if($scope.formData.cliente.afiliado == 'Si' || $scope.formTemp.cortesia == 'Si')
				$scope.formTemp.tiene_descuento = 'No';	

			if($scope.formTemp.programa){
				//Actualizar especialidad
				Programas.query({ query: { _id: $scope.formTemp.programa, estado: 'Activo' } })
					.success(function(data) { 
						$scope.formTemp.especialidad = angular.copy(data.instanceList[0].especialidad); 
						//Buscar Proveedores
						Proveedores.query({ query: { especialidades: $scope.formTemp.especialidad , estado: 'Activo' } })
							.success(function(data) { 
								$scope.Proveedores = angular.copy(data.instanceList); 
							})
							.error(function(data, status) {
								$scope.showMessage(true, $scope.messageAlertDanger, $scope.label.errorResults, status, data);
				            });
					})
					.error(function(data, status) {
						$scope.showMessage(true, $scope.messageAlertDanger, $scope.label.errorResults, status, data);
		            });   

				//Buscar el programa seleccionado dentro de la lista de programas para obtener datos
		        var programa = _.find($scope.Programas, function(programa){ return programa._id ==$scope.formTemp.programa; });
		        $scope.formTemp.nombre_programa = programa.nombre;
		        //TABLA DE VERDAD DE PRECIOS AFILIADOS Y DESCUENTOS
		        //Afiliado && Descuento = suciqroo
				//Afiliado && NODescuento = suciqroo
				//NoAfiliado && Descuento = suciqroo
				//NoAfiliado && NODescuento = publico
		        
				//Si es afiliado tomamos el precio suciqroo
		        $scope.formTemp.precio = ($scope.formData.cliente.afiliado=='Si')? programa.precio_suciqroo : programa.precio_publico;
		        //Si tiene descuento calculamos el descuento quitandole al precio publico el precio de suciqroo
		        $scope.formTemp.descuento = ($scope.formTemp.tiene_descuento=='Si' && $scope.formData.cliente.afiliado=='No')? programa.precio_publico - programa.precio_suciqroo : 0;
				//Si es cortesia - Se aplica el monto_apoyo_terceros, para el pago del doctor pero no se cobra al cliente
		        $scope.formTemp.descuento = ($scope.formTemp.cortesia=='Si')? $scope.formTemp.precio : $scope.formTemp.descuento;
		        //Calculamos total
		        $scope.formTemp.total = $scope.formTemp.precio - $scope.formTemp.descuento;
		        //Agregamos monto terceros
		        $scope.formTemp.monto_apoyo_terceros = programa.monto_apoyo_terceros;
		        //Agregamos monto suciqroo
		        $scope.formTemp.monto_suciqroo = $scope.formTemp.total - programa.monto_apoyo_terceros;

		        /*$scope.formTemp.precio = ($scope.formData.cliente.afiliado=='No' && $scope.formTemp.descuento=='No' )? programa.precio_publico : programa.precio_suciqroo;
				//SI EXISTE CORTESIA - Se aplica el monto_apoyo_terceros, para el pago del doctor pero no se cobra al cliente
		        $scope.formTemp.precio = ($scope.formTemp.cortesia=='Si')? programa.monto_apoyo_terceros : $scope.formTemp.precio;
		        $scope.formTemp.monto_apoyo_terceros = programa.monto_apoyo_terceros;*/
		    }
		};

		$scope.addPrograma = function(){

			var isValidCliente = $scope.validateCliente(true);
			//console.log(isValidCliente);
			if(isValidCliente){
				if($scope.formTemp.programa){
					//Buscar el programa seleccionado dentro de la lista de programas para obtener datos
					var data = {
						_id: $scope.formTemp.programa,
						nombre: $scope.formTemp.nombre_programa,
						precio: $scope.formTemp.precio,
						descuento: $scope.formTemp.descuento,
						total: $scope.formTemp.total,
						monto_apoyo_terceros: $scope.formTemp.monto_apoyo_terceros,
						monto_suciqroo: $scope.formTemp.monto_suciqroo,
						tiene_descuento: $scope.formTemp.tiene_descuento,
						cortesia: $scope.formTemp.cortesia,
						//pagado: 'No',
						//fecha_pago: null,
						especialidad: {},
						proveedor: {},
					};

					if($scope.formTemp.especialidad){
						var especialidad = _.find($scope.Especialidades, function(especialidad){ return especialidad._id ==$scope.formTemp.especialidad; });
						data.especialidad._id = especialidad._id;
						data.especialidad.nombre = especialidad.nombre;
					}

					if($scope.formTemp.proveedor){
						var proveedor = _.find($scope.Proveedores, function(proveedor){ return proveedor._id ==$scope.formTemp.proveedor; });
						data.proveedor._id = proveedor._id;
						data.proveedor.nombre = proveedor.nombre_completo;
					}

			        $scope.formData.programas.push(data);
			        $scope.getTotalPrograma();

			        //$scope.lockCliente(true);
			        $scope.formTemp.lockCliente = true

			        //Delete form data
			        delete $scope.formTemp.especialidad;
	           		delete $scope.formTemp.programa;
	           		delete $scope.formTemp.proveedor;
			        delete $scope.formTemp.nombre_programa;
			        delete $scope.formTemp.precio;
			        delete $scope.formTemp.descuento;
			        delete $scope.formTemp.total;
			        delete $scope.formTemp.monto_apoyo_terceros;
			        delete $scope.formTemp.monto_suciqroo;
			        $scope.formTemp.cortesia = 'No';
			        $scope.formTemp.tiene_descuento = 'No';
			        $scope.showMessage(false, '', '');
			    } else {
			    	$scope.showMessage(true, $scope.messageAlertInfo, 'Seleccione un Programa ', status, data);
			    }
		    }
		};

		$scope.removePrograma = function(data){
			if(data){
				$scope.formData.programas = _.without($scope.formData.programas,data);
		    }
		    $scope.getTotalPrograma();
		};

		$scope.getTotalPrograma = function(){
			var total = 0;
			if($scope.formData.programas){
				angular.forEach($scope.formData.programas, function(programa) {
					total += programa.total;
				});
			}
			$scope.formData.monto_total = total;			
			$scope.recalculateIndexProgramas();
		}

		$scope.recalculateIndexProgramas = function(){
			angular.forEach($scope.formData.programas, function(programa, index) {
		  		programa.index = index;
			});
		}

		$scope.resetCliente = function(){
			$scope.formData.cliente = {afiliado:'No'};
			$scope.formData.programas = [];
			$scope.formTemp.lockCliente = false;
			delete $scope.formData.monto_total;
		}

		$scope.resetProgramasTable = function(){
			$scope.formData.programas = [];
			delete $scope.formData.monto_total;
			$scope.resetProgramasSearch();
		}

		$scope.resetProgramasSearch = function(){
			Especialidades.query({ query: { estado: 'Activo' } })
				.success(function(data) { $scope.Especialidades = angular.copy(data.instanceList); })
				.error(function(data, status) {
					$scope.showMessage(true, $scope.messageAlertDanger, $scope.label.errorResults, status, data);
	            });

			Programas.query({ query: { estado: 'Activo' } })
				.success(function(data) { $scope.Programas = angular.copy(data.instanceList); })
				.error(function(data, status) {
					$scope.showMessage(true, $scope.messageAlertDanger, $scope.label.errorResults, status, data);
	            });

	        Proveedores.query({ query: { estado: 'Activo' } })
				.success(function(data) { $scope.Proveedores = angular.copy(data.instanceList); })
				.error(function(data, status) {
					$scope.showMessage(true, $scope.messageAlertDanger, $scope.label.errorResults, status, data);
	            });

           	delete $scope.formTemp.especialidad;
       		delete $scope.formTemp.programa;
       		delete $scope.formTemp.proveedor;
	        delete $scope.formTemp.nombre_programa;
	        delete $scope.formTemp.precio;
	        delete $scope.formTemp.descuento;
	        delete $scope.formTemp.total;
	        delete $scope.formTemp.monto_apoyo_terceros;
	        delete $scope.formTemp.monto_suciqroo;
	        $scope.formTemp.cortesia = 'No';
	        $scope.formTemp.tiene_descuento = 'No';
		};

		$scope.validateCliente = function(addPrograma){
			var isValid = false;
			var mess = '';
			if( $scope.formData.cliente.nombre &&
				$scope.formData.cliente.apPaterno &&
				$scope.formData.cliente.apMaterno &&
				$scope.formData.cliente.direccion &&
				$scope.formData.cliente.telefono
			) {
				//Campos OK
				if($scope.formData.cliente.afiliado == 'Si' && !$scope.formData.cliente.credencial){
					isValid = false;
					$scope.showMessage(true, $scope.messageAlertWarning, 'Cliente afiliado debe tener numero de credencial');
				} else {
					//-------------- VALIDAR NUMERO DE CREDENCIAL ----------------------
					var isValidCredencial = false;
					if($scope.formData.cliente.afiliado == 'Si'){ //Afiliado y en este punto se debe tener el numero de credencial
						//Validar numero credencial
						var cliente = _.filter($scope.Clientes, function(cliente){ return cliente.credencial == $scope.formData.cliente.credencial; });
						if(cliente.length == 0){ //Si no hay duplicado
							isValidCredencial = true;
						} else if (cliente.length == 1 && $scope.formData.cliente._id && cliente[0]._id == $scope.formData.cliente._id){
							//Si el duplicado corresponde al cliente seleccionado en el combo
							isValidCredencial = true;
						} else {
							isValidCredencial = false;
						}
					} else { //Si no es afiliado, no hay necesidad de validar credencial, se toma como valida automaticamente
						isValidCredencial = true;
					}
					//-------------- FIN VALIDAR CREDENCIAL --------------

					if(isValidCredencial){
						var nombre_completo = $scope.formData.cliente.nombre+' '+$scope.formData.cliente.apPaterno+' '+$scope.formData.cliente.apMaterno;
						nombre_completo = nombre_completo.trim();
						nombre_completo = angular.lowercase(nombre_completo);
						var cliente = _.filter($scope.Clientes, function(cliente){ return angular.lowercase(cliente.nombre_completo) == nombre_completo; });
						if(cliente.length == 0){ //Si no hay duplicado
							if($scope.formData.programas.length > 0 || addPrograma) {
								isValid = true;
							} else {
								isValid = false;
								$scope.showMessage(true, $scope.messageAlertInfo, 'Seleccione un programa');
							}

						} else if (cliente.length == 1 && $scope.formData.cliente._id && angular.lowercase(cliente[0].nombre_completo) == nombre_completo){
							//Si el duplicado corresponde al nombre del cliente seleccionado en el combo
							if($scope.formData.programas.length > 0 || addPrograma){
								isValid = true;
							} else {
								isValid = false;
								$scope.showMessage(true, $scope.messageAlertInfo, 'Seleccione un programa');
							}
						} else {
							isValid = false;
							$scope.showMessage(true, $scope.messageAlertWarning, 'Nombre no valido, nombre duplicado');
						}
					} else {
						isValid = false;
						$scope.showMessage(true, $scope.messageAlertWarning, 'Credencial no valida, credencial duplicada');
					}
				}
			} else {
				isValid = false;
				$scope.showMessage(true, $scope.messageAlertWarning, 'Campos de cliente no llenados completamente');
			}
			return isValid;
		}

		$scope.cancelarFicha = function(){
			$scope.showMessage(false, '', '');
			if($scope.formData.pagado == 'Si' || $scope.formData.pagado_parcialmente == 'Si' ){
				var mess = 'No se puede cancelar esta ficha debido a algunos programas '+
				'ya estan facturados, primero cancele la(s) factura(s) de esta ficha'
				$scope.showMessage(true, $scope.messageAlertWarning, mess);
			} else {
				if($scope.formData.comentario != undefined && $scope.formData.comentario != ''){
					$scope.formData.estado = 'Inactivo';
					$scope.createOrUpdate(true, $scope.formData._id);
				} else {
					$scope.showMessage(true, $scope.messageAlertWarning, 'Escriba el motivo de la cancelacion en el campo comentario');
				}
			}
		}

		$scope.imprimirFicha = function(_id){
			var listReportes = Reportes.getReportes();
			console.log(listReportes);
			var reporte = _.find(listReportes, function(reporte){ return reporte.nombre == 'Ficha'; });
			Reportes.getReporteById(angular.copy(reporte), { ficha: _id}, false);
		}

	}]);