angular.module('EgresoCtrl',[])

	.controller('EgresoController', ['$rootScope','$scope','$routeParams','$location','Main','Egresos','Oficinas', function($rootScope, $scope, $routeParams, $location, Main, Egresos, Oficinas) {
		$scope.controlNameSingular = 'Egreso';
		$scope.controlNamePlural = 'Egresos';
		$scope.controllerInstance = 'egresos';

		$scope.label = {};
		$scope.label.search = 'Buscar';
		$scope.label.searchResults = 'Resultados de la búsqueda: ';
		$scope.label.add = 'Nuevo';
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
		$scope.label.back = 'Regresar';
		$scope.label.egreso = 'Egreso';

		$scope.messageShow = false;
		$scope.messageClass = "";
		$scope.messageText = '';
		$scope.messageAlertSuccess = 'alert-success';
		$scope.messageAlertInfo = 'alert-info';
		$scope.messageAlertDanger = 'alert-danger';

		$scope.searchData = {};
		$scope.formTemp = { usuario_modifico: {} };
		$scope.formData = {estado:'Activo', usuario: {}, oficina: {} };

		$scope.instanceList = [];
		$scope.Oficinas = [];
		
		$scope.totalItems = 0;
		$scope.currentPage = 1;
		$scope.itemsPerPage = 5;
		$scope.textPagination = '';

		$scope.model = { 
						folio: 'Folio',
						fecha: 'Fecha',
						monto_salida: 'Monto salida',
						monto_total: 'Monto total',
						monto_cambio: 'Monto cambio',
						concepto: 'Concepto',
						descripcion: 'Descripcion',
						comentario: 'Comentario',
						oficina: 'Oficina',
						estado: 'Estado',
						factura: 'Factura',
						oficina: {
							nombre:	'Oficina',
						},
						usuario: {
							creo: 'Usuario creó',
							modifico: 'Usuario modificó',
							fecha_creo: 'Fecha alta',
							fecha_modifico: 'Fecha modificó',
						},
					};

		//USADOS POR DATEPICKER
		$scope.popup1 = { opened: false };
		$scope.dateOptions = {
	    	//dateDisabled: false,
		    //formatYear: 'yyyy',
		    //maxDate: new Date(2016, 5, 22),
		    //minDate: new Date(),
		    //startingDay: 1
	  	};
	  	
	  	$scope.open = function(popup) {
	  		switch(popup){
	  			case 1:
	  				$scope.popup1.opened = true;
	  				break;
	  		}
		};

		$scope.inicio = function(){
			Main.getPrivilegios().then(function(){ $scope.privilegios = $rootScope.privilegios; });
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
					  				{nombre: { $regex : data, $options:"i" } },
					  				{descripcion: { $regex : data, $options:"i" } },
					  				]
					  			};
			} else {
				$scope.searchData.active = false;
				$scope.messageShow = false;
	  			query.query = {};
			}
			
			query.limit = $scope.itemsPerPage;
    		query.page = $scope.currentPage-1;
    		query.sort = { id: 1 };
			$scope.query(query);
		}


		$scope.query = function(query){
			Egresos.query(query)
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
			Oficinas.query({ query: { estado: 'Activo' } })
				.success(function(data) { $scope.Oficinas = angular.copy(data.instanceList); })
				.error(function(data, status) {
					$scope.showMessage(true, $scope.messageAlertDanger, $scope.label.errorResults, status, data);
	            });

			Main.me(
				//).success(
				function(userData) {
					$scope.label.createOrEdit = $scope.label.add;
					if($routeParams.instanceId != undefined){
						//Variables de control de edicion
						$scope.formTemp.statusEditable = true; //Campos de activo y usurio creo
						$scope.formTemp.noEditable = true; //Evitar poder editar cliente y programas
						if($scope.formTemp.noEditable){
							$scope.formTemp.lockFactura = true;
						}

						Egresos.findById($routeParams.instanceId)
							.success(function(dataEgreso) {
								$scope._id = $routeParams.instanceId;
								$scope.formData = angular.copy(dataEgreso);
								$scope.formData.fecha = new Date($scope.formData.fecha);
								$scope.label.createOrEdit = '';
								$scope.label.other = dataEgreso.folio_egreso;
								//Agregamos usuario modifico
								$scope.formTemp.usuario_modifico._id = userData.data._id;
								$scope.formTemp.usuario_modifico.usuario = userData.data.usuario;
								$scope.formTemp.usuario_modifico.nombre = userData.data.nombre_completo;
							})
							.error(function(dataEgreso, status) {
								$scope.showMessage(true, $scope.messageAlertDanger, $scope.label.noFindRow, status, data);
								$location.path('/'+$scope.controllerInstance);
				            })
							;
					} else {
						//console.log($scope.Oficinas);
						$scope.formData.usuario._id = userData.data._id;
						$scope.formData.usuario.usuario = userData.data.usuario;
						$scope.formData.usuario.nombre = userData.data.nombre_completo;
					}
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
					Egresos.update(_id,$scope.formData)
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
					$scope.formData.usuario.fecha = new Date(); //Fecha creacion
					$scope.formData.anio = new Date().getFullYear(); //Fecha creacion
					Egresos.create($scope.formData)
						.success(function(data) {
							$scope.formData = {};
							console.log($scope.label.createSuccess);
							$location.path('/'+$scope.controllerInstance);
							//COMO ENVIAR ALERTA?							
							//$scope.messageShow = true;
							//$scope.messageClass = $scope.messageAlertSuccess;
							//$scope.messageText = $scope.label.createSuccess;
						})
						.error(function(data, status) {
							$scope.formTemp.lockButtonSave = false;
							$scope.showMessage(true, $scope.messageAlertDanger, $scope.label.createFailed, status, data);
			            })
						;
				}
			} else {
				$scope.formTemp.lockButtonSave = false;
				$scope.showMessage(true, $scope.messageAlertDanger, $scope.label.invalidDataForm);
			}
		};

		$scope.delete = function(_id) {
			//Egresos.delete(_id);
		};

		$scope.showMessage = function(show,type,message,status,data) {
			$scope.messageShow = show;
			$scope.messageClass = type;
			$scope.messageText = message;
			if(status){
				console.log('Error: ' + status);
	        	console.log(data);
			}
		};

		$scope.getDataOficina = function(){
			if($scope.formData.oficina._id){
				//Buscar el programa seleccionado dentro de la lista de programas para obtener datos
		        var oficina = _.find($scope.Oficinas, function(oficina){ return oficina._id ==$scope.formData.oficina._id; });
		        $scope.formData.oficina.nombre = oficina.nombre;
		    }
		};

		$scope.calculateCambio = function() {
			console.log('test');
			if($scope.formData.monto_salida != undefined && $scope.formData.monto_total != undefined )
				$scope.formData.monto_cambio = $scope.formData.monto_salida - $scope.formData.monto_total;
			else
				delete $scope.formData.monto_cambio;
		};

	}]);