angular.module('FacturaCtrl',[])

	.controller('FacturaController', ['$rootScope','$scope','$routeParams','$location','Main','Facturas','Fichas', 'Egresos','Users','Oficinas','Especialidades','Programas','Proveedores','Clientes', 'Reportes', function($rootScope,$scope, $routeParams, $location, Main, Facturas, Fichas, Egresos, Users, Oficinas, Especialidades, Programas, Proveedores, Clientes, Reportes) {
		$scope.controlNameSingular = 'Factura';
		$scope.controlNamePlural = 'Facturas';
		$scope.controllerInstance = 'facturas';

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
		$scope.label.proveedor = 'Proveedor';
		$scope.label.programas = 'Programas';
		$scope.label.seleccionar = 'Seleecionar / Deseleccionar Todos';
		$scope.label.pagar = 'Pagar';

		$scope.messageShow = false;
		$scope.messageClass = "";
		$scope.messageText = '';
		$scope.messageAlertSuccess = 'alert-success';
		$scope.messageAlertInfo = 'alert-info';
		$scope.messageAlertWarning = 'alert-warning';
		$scope.messageAlertDanger = 'alert-danger';

		$scope.searchData = {};
		$scope.formTemp = {tiene_descuento: 'No', cortesia: 'No', usuario: { oficina: {} }, usuario_modifico: { oficina: {} }, programas: [], fichas: {}, allSelected: true };
		$scope.formData = {estado:'Activo', afiliado:'No', /*pagado:'No',*/ pagado_parcialmente:'No', cliente:{afiliado:'No'}, usuario: { oficina: {} }, programas:[] };

		$scope.instanceList = [];
		//$scope.Usuarios = [];
		$scope.Proveedores = [];
		$scope.Especialidades = [];
		$scope.Programas = [];
		//$scope.Clientes = [];
		
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
						estado: 'Estado',

						//Usados
						monto_total: 'Monto total',
						concepto: 'Concepto',
						comentario: 'Comentario',
						proveedor: {
							_id: 'Proveedor',
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
							ficha: 'Ficha',
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
	  			query.query = 	{ $or: [
					  				{'proveedor.nombre': { $regex : data, $options:"i" } },
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
			Facturas.query(query)
				.success(function(data) {
					$scope.instanceList = angular.copy(data.instanceList);
					$scope.totalItems = data.totalItems;
					$scope.calculateTextPagination();
					if($scope.searchData.active){
						$scope.showMessage(true, $scope.messageAlertInfo, $scope.messageText = $scope.label.searchResults+' "'+$scope.searchData.data+'"... ');
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

			/*Clientes.query({ query: { estado: 'Activo' } })
				.success(function(data) { $scope.Clientes = angular.copy(data.instanceList); })
				.error(function(data, status) {
					$scope.showMessage(true, $scope.messageAlertDanger, $scope.label.errorResults, status, data);
	            });*/

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
									$scope.formTemp.lockProveedor = true;
								}

								Facturas.findById($routeParams.instanceId)
									.success(function(dataFactura) {
										$scope._id = $routeParams.instanceId;
										$scope.formData = angular.copy(dataFactura);
										$scope.label.createOrEdit = '';
										$scope.label.other = dataFactura.folio_factura;
										//AGregamos usuario modifico
										dataOficina = dataOficina.instanceList[0];
										$scope.formTemp.usuario_modifico._id = userData.data._id;
										$scope.formTemp.usuario_modifico.usuario = userData.data.usuario;
										$scope.formTemp.usuario_modifico.nombre = userData.data.nombre_completo;
										$scope.formTemp.usuario_modifico.oficina._id = dataOficina._id;
										$scope.formTemp.usuario_modifico.oficina.nombre = dataOficina.nombre;
										//$scope.formData.usuario_modifico = $scope.formTemp.usuario_modifico;
										$scope.getDataProveedor();
										$scope.getDataFichasByFactura();
									})
									.error(function(dataFactura, status) {
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

						}).error(
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
				if($scope.validateProveedor()){ //VALIDAMOS PROVEEDOR
					if(_id != undefined) {
						$scope.formData.usuario_modifico = $scope.formTemp.usuario_modifico; //Asginamos nuevo usuario modifico
						$scope.formData.usuario_modifico.fecha = new Date(); //Fecha modificacion
						var update = _.omit($scope.formData,'_id');
						Facturas.update(_id,update)
							.success(function(data) {
								$scope.updateFichas(data);
								//$scope.formData = {};
								//console.log($scope.label.updateSuccess);
								//$location.path('/'+$scope.controllerInstance);
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
						$scope.formData.usuario.fecha = new Date(); //Fecha creacion
						$scope.formData.anio = new Date().getFullYear(); //Fecha creacion
						//Creamos factura
						Facturas.create($scope.formData).success(function(data) {
							console.log('-- DAta factgura');
							console.log(data);
								$scope.updateFichas(data);
								//$scope.formData = {};
								//console.log($scope.label.createSuccess);
								//$location.path('/'+$scope.controllerInstance);
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
			} else {
				$scope.formTemp.lockButtonSave = false;
				$scope.showMessage(true, $scope.messageAlertDanger, $scope.label.invalidDataForm);
			}
		};

		$scope.updateFichas = function(factura) {
			console.log('-- Fctura');
			console.log(factura);
			var arrQuery = [];
			angular.forEach($scope.formData.programas, function(programa, key) {
				var query = {};	
				query.query = {
								$and: [
									{ _id: programa.ficha },
									{ 'programas.index': programa.index }
								]
							};
				query.data = {
								$set: {
									//'pagado_parcialmente': 'Si',
									//Si esta considerado para pago se agregan los valores, en caso contrario se ponen los defualt
								    'programas.$.pagado': (programa.toPago=='Si') ? 'Si' : 'No',
								    'programas.$.fecha_pago': (programa.toPago=='Si') ? new Date() : undefined,
								    //'programas.$.factura': (programa.toPago=='Si') ? FacturaId : undefined,
								    'programas.$.factura._id': factura._id,
								    'programas.$.factura.folio_factura': factura.folio_factura,
								} 
							};
				arrQuery.push(query);
			});
			console.log(arrQuery);

			//ACTUALIZAR FICHAS PROGRAMAS
			Facturas.updateFichasProgramas(arrQuery)
			.success(function(data) {
				$scope.formData = {};
				console.log($scope.label.updateSuccess);
				$location.path('/'+$scope.controllerInstance);
			})
			.error(function(data, status) {
				$scope.showMessage(true, $scope.messageAlertDanger, $scope.label.updateFailed, status, data);
            })
			;

			
		};

		$scope.delete = function(_id) {
			//Facturas.delete(_id);
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

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		//Funciones para llenado del formulario

		$scope.getDataProveedor = function(){
			if($scope.formData.proveedor._id){
				//Buscar el programa seleccionado dentro de la lista de programas para obtener datos
		        var proveedor = _.find($scope.Proveedores, function(proveedor){ return proveedor._id ==$scope.formData.proveedor._id; });
		        $scope.formData.proveedor.nombre = proveedor.nombre_completo;
		        $scope.formData.proveedor.direccion = proveedor.direccion;
		        $scope.formData.proveedor.telefono = proveedor.telefono;
		        $scope.formData.proveedor.email = proveedor.email;
		        $scope.formData.proveedor.estado = proveedor.estado;
		    }
		    //$scope.getDataPrograma();
		};

		$scope.getDataFichasByProveedor = function(){
			$scope.showMessage(false, '', '');
			if($scope.formData.proveedor){
				//Buscar las fichas que hayan endido programas por el proveedor
				//var query = { 'programas' $in: [] };
				var query = { query: { 
										$and: [ 
											{ 'estado': 'Activo' },
											{ 'programas.proveedor._id': $scope.formData.proveedor._id },
										] 
									} 
							};
				//var query = {'programas': { $elemMatch: {'proveedor._id': $scope.formData.proveedor._id } } };
				Fichas.query(query)
					.success(function(data) { 
						console.log(data);
						$scope.formTemp.fichas = angular.copy(data.instanceList); 
						var programas = [];
						angular.forEach($scope.formTemp.fichas, function(ficha, key) {
							//console.log(ficha.programas)
							//var ps = _.filter(ficha.programas, function(p){ return p.proveedor._id == $scope.formData.proveedor._id; });
							//this.push(ps);
							var fichaId = ficha._id;
							var fichaFolioFicha = ficha.folio_ficha;
							angular.forEach(ficha.programas, function(programa, key) {
								//var prog = { ficha: fichaId, programa: programa._id, index: programa.index};
								//var prog = { ficha: fichaId };
								console.log(programa.proveedor);
								if(programa.pagado=='No' && programa.proveedor != undefined ){
									if(programa.proveedor._id == $scope.formData.proveedor._id){
										programa.ficha = fichaId; //Añadimos campo ficha
										programa.folio_ficha = fichaFolioFicha; //Añadimos campo ficha
										programa.toPago = 'Si'; //Añadimos campo ficha
										this.push(programa);	
									}
								}
							},programas);
						}, programas);

						//var programas = _.where($scope.formTemp.fichas, { 'programas.proveedor._id' : $scope.formData.proveedor._id });
						$scope.formData.programas = angular.copy(programas); 
						//$scope.formTemp.programas = angular.copy($scope.formTemp.fichas.programas); 
						//console.log($scope.formTemp.fichas);
						//console.log($scope.formTemp.fichas.programas);
						console.log(programas);

						if($scope.formData.programas.length > 0){
							$scope.formTemp.lockProveedor = true;
							$scope.getTotalPrograma()
						} else {
							$scope.showMessage(true, $scope.messageAlertInfo, $scope.label.noResults);	
						}
					})
					.error(function(data, status) {
						$scope.showMessage(true, $scope.messageAlertDanger, $scope.label.errorResults, status, data);
		            });		        
		    } else {
		    	$scope.showMessage(true, $scope.messageAlertWarning, 'Elija un proveedor');
		    }
		};

		$scope.getDataFichasByFactura = function(){
			$scope.showMessage(false, '', '');
			if($scope.formData.proveedor._id){
				//Buscar las fichas que hayan endido programas por el proveedor
				//var query = { 'programas' $in: [] };
				var query = { query: { 'programas.factura._id': $scope.formData._id } };
				//var query = {'programas': { $elemMatch: {'proveedor._id': $scope.formData.proveedor._id } } };
				Fichas.query(query)
					.success(function(data) { 
						console.log(data);
						$scope.formTemp.fichas = angular.copy(data.instanceList); 
						var programas = [];
						angular.forEach($scope.formTemp.fichas, function(ficha, key) {
							//console.log(ficha.programas)
							//var ps = _.filter(ficha.programas, function(p){ return p.proveedor._id == $scope.formData.proveedor._id; });
							//this.push(ps);
							var fichaId = ficha._id;
							var fichaFolioFicha = ficha.folio_ficha;
							angular.forEach(ficha.programas, function(programa, key) {
								//var prog = { ficha: fichaId, programa: programa._id, index: programa.index};
								//var prog = { ficha: fichaId };

								console.log(programa.proveedor);
								if( ( programa.pagado=='Si' && programa.proveedor != undefined) || $scope.formData.estado=='Inactivo' ){
									if(programa.proveedor._id == $scope.formData.proveedor._id){
										programa.ficha = fichaId; //Añadimos campo ficha
										programa.folio_ficha = fichaFolioFicha; //Añadimos campo ficha
										programa.toPago = 'Si'; //Añadimos campo ficha
										this.push(programa);	
									}
								}
							},programas);
						}, programas);

						//var programas = _.where($scope.formTemp.fichas, { 'programas.proveedor._id' : $scope.formData.proveedor._id });
						$scope.formData.programas = angular.copy(programas); 
						//$scope.formTemp.programas = angular.copy($scope.formTemp.fichas.programas); 
						//console.log($scope.formTemp.fichas);
						//console.log($scope.formTemp.fichas.programas);
						console.log(programas);

						if($scope.formData.programas.length > 0){
							$scope.formTemp.lockProveedor = $scope.formTemp.noEditable;
							//$scope.getTotalPrograma()
						} else {
							$scope.showMessage(true, $scope.messageAlertInfo, $scope.label.noResults);	
						}
					})
					.error(function(data, status) {
						$scope.showMessage(true, $scope.messageAlertDanger, $scope.label.errorResults, status, data);
		            });		        
		    } else {
		    	$scope.showMessage(true, $scope.messageAlertWarning, 'Elija un proveedor');
		    }
		};

		$scope.getTotalPrograma = function(){
			var total = 0;
			if($scope.formData.programas){
				angular.forEach($scope.formData.programas, function(programa) {
					if(programa.toPago=='Si')
						//total += programa.total;
						total += programa.monto_apoyo_terceros; //Se toma en cuenta la cantidad de terceros
				});
			}
			$scope.formData.monto_total = total;			
			//$scope.recalculateIndexProgramas();
		}

		/*
		$scope.recalculateIndexProgramas = function(){
			angular.forEach($scope.formData.programas, function(programa, index) {
		  		programa.index = index;
			});
		}
		*/

		$scope.resetProveedor = function(){
			$scope.formData.proveedor = {afiliado:'No'};
			$scope.formData.programas = [];
			$scope.formTemp.lockProveedor = false;
			delete $scope.formData.monto_total;
		}

		$scope.sellectAllProgramasTable = function(){
			//$scope.formData.programas = [];
			//delete $scope.formData.monto_total;
			//$scope.resetProgramasSearch();

			if($scope.formData.programas){
				$scope.formTemp.allSelected = !$scope.formTemp.allSelected
				angular.forEach($scope.formData.programas, function(programa) {
					if($scope.formTemp.allSelected)
						programa.toPago = 'Si';
					else
						programa.toPago = 'No';
				});
			}
			$scope.getTotalPrograma();
		}

		$scope.validateProveedor = function(){
			var isValid = false;
			var mess = '';
			if( $scope.formData.proveedor._id /*&& $scope.formData.proveedor.estado == 'Activo'*/) {
				if($scope.formData.programas.length > 0 ){
					var atLeastOnePago = false;
					angular.forEach($scope.formData.programas, function(programa, key) {
						if(programa.toPago == 'Si' )
							atLeastOnePago = true;
					});
					//Valido si esta seleccionado un pago o si la factura esta inactiva
					if(atLeastOnePago || $scope.formData.estado=='Inactivo' ){
						isValid = true;
					} else {
						isValid = false;
						$scope.showMessage(true, $scope.messageAlertWarning, 'Al menos un programa debe estar seleccionado');
					}
				} else {
					isValid = false;
					$scope.showMessage(true, $scope.messageAlertWarning, 'No existen programas para facturar');
				}
			} else {
				isValid = false;
				$scope.showMessage(true, $scope.messageAlertWarning, 'El proveedor no es valido');
			}
			return isValid;
		}

		$scope.cancelarFactura = function(){
			$scope.showMessage(false, '', '');
			if($scope.formData.comentario != undefined && $scope.formData.comentario != ''){
				$scope.formData.estado = 'Inactivo';
				//Mandamos porogramas a que se desactiven
				angular.forEach($scope.formData.programas, function(programa, key) {
					programa.toPago = 'No';
				});
				//CANCELAMOS EGRESO Y DESPUES MANDAMOS A CANCELAR FACTURA
				$scope.cancelarEgreso();
			} else {
				$scope.showMessage(true, $scope.messageAlertWarning, 'Escriba el motivo de la cancelacion en el campo comentario');
			}
		}

		$scope.cancelarEgreso = function(){
			if($scope.formData._id != undefined && $scope.formData.estado == 'Inactivo'){
				//ACTUALIZAR FICHAS PROGRAMAS
				$scope.formTemp.usuario_modifico.fecha = new Date(); //Fecha modificacion
				var query = {};	
				query.query = { 'factura._id': $scope.formData._id };
				query.data = {
								$set: {
									estado: 'Inactivo',
									usuario_modifico: $scope.formTemp.usuario_modifico, 
								} 
							};
				Facturas.updateEgresoByFactura(query)
					.success(function(data) {
						console.log($scope.label.updateSuccess);
						//MANDAMOS A CANCELAR FACTURA
						$scope.createOrUpdate(true, $scope.formData._id);
					})
					.error(function(data, status) {
						$scope.showMessage(true, $scope.messageAlertDanger, $scope.label.updateFailed, status, data);
		            })
					;

			} else {
				$scope.showMessage(true, $scope.messageAlertDanger, 'Error al cancelar');
			}
		}

		$scope.imprimirFactura = function(_id){
			var listReportes = Reportes.getReportes();
			console.log(listReportes);
			var reporte = _.find(listReportes, function(reporte){ return reporte.nombre == 'Factura'; });
			Reportes.getReporteById(angular.copy(reporte), { factura: _id}, false);
		}


	}]);