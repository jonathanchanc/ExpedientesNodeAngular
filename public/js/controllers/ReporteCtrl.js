angular.module('ReporteCtrl',[])

	.controller('ReporteController', ['$rootScope','$scope','$routeParams','$location','Main','Reportes', 'Fichas', 'Facturas', 'Egresos', 'Especialidades', 'Programas', 'Proveedores', 'Clientes', 'Users', function($rootScope, $scope, $routeParams, $location, Main, Reportes, Fichas, Facturas, Egresos, Especialidades, Programas, Proveedores, Clientes, Users) {
		$scope.controlNameSingular = 'Reporte';
		$scope.controlNamePlural = 'Reportes';
		$scope.controllerInstance = 'reportes';

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
		$scope.label.yes = 'Si';
		$scope.label.no = 'No';

		$scope.messageShow = false;
		$scope.messageClass = "";
		$scope.messageText = '';
		$scope.messageAlertSuccess = 'alert-success';
		$scope.messageAlertInfo = 'alert-info';
		$scope.messageAlertDanger = 'alert-danger';

		$scope.searchData = {};
		$scope.filtros = {};
		$scope.formTemp = { filtros: [], estado:'', pagado:'' };
		$scope.formData = { reporte: { filtros:[] } };

		$scope.instanceList = [];
		$scope.dataReporte = [];
		$scope.Especialidades = [];
		$scope.Programas = [];
		$scope.Proveedores = [];
		$scope.Clientes = [];
		$scope.Usuarios = [];
		$scope.Fichas = [];
		$scope.Facturas = [];
		$scope.Egresos = [];
		
		$scope.totalItems = 0;
		$scope.currentPage = 1;
		$scope.itemsPerPage = 5;
		$scope.textPagination = '';

		//USADOS POR DATEPICKER
		$scope.popup1 = { opened: false };
		$scope.popup2 = { opened: false };
		$scope.dateOptionsIni = {};
		$scope.dateOptionsFin = {};
		//$scope.dateOptions = {
	    	//dateDisabled: false,
		    //formatYear: 'yyyy',
		    //minDate: $scope.formTemp.fecha_ini,
		    //maxDate: $scope.formTemp.fecha_fin,
		    //startingDay: 1
	  	//};
	  	
	  	$scope.open = function(popup) {
	  		switch(popup){
	  			case 1:
	  				$scope.popup1.opened = true;
	  				break;
  				case 2:
  					$scope.popup2.opened = true;
	  				break;
	  		}

	  		if($scope.formTemp.$gte!=undefined)
	  			$scope.dateOptionsFin['minDate'] = $scope.formTemp.$gte;
	  		
	  		if($scope.formTemp.$lte!=undefined)
	  			$scope.dateOptionsIni['maxDate'] = $scope.formTemp.$lte;
		};

		$scope.modelTemp = {
			cliente: 'Cliente',
			especialidad: 'Especialidad',
			programa: 'Programa',
			proveedor: 'Proveedor',
			usuario: 'Usuario',
			ficha: 'Ficha',
			factura: 'Factura',
			egreso: 'Egreso',
			fecha_ini: 'Fecha Inicio',
			fecha_fin: 'Fecha Final',
			estado: 'Estado',
			pagado: 'Pagado',
		}

		$scope.model = { 
						reporte: 'Reporte',
						nombre: 'Nombre',
						descripcion: 'Descripción',
						estado: 'Estado',
						consultar: 'Consultar',
						descargar: 'Descargar',
					};

		$scope.Reportes = Reportes.getReportes();

		$scope.inicio = function(){
			Main.getPrivilegios().then(function(){ $scope.privilegios = $rootScope.privilegios});
			console.log('Modulo de reportes');
			Especialidades.query({ query: { } })
				.success(function(data) { $scope.Especialidades = angular.copy(data.instanceList); })
				.error(function(data, status) {
					$scope.showMessage(true, $scope.messageAlertDanger, $scope.label.errorResults, status, data);
	            });

			Programas.query({ query: { } })
				.success(function(data) { $scope.Programas = angular.copy(data.instanceList); })
				.error(function(data, status) {
					$scope.showMessage(true, $scope.messageAlertDanger, $scope.label.errorResults, status, data);
	            });

	        Proveedores.query({ query: { } })
				.success(function(data) { $scope.Proveedores = angular.copy(data.instanceList); })
				.error(function(data, status) {
					$scope.showMessage(true, $scope.messageAlertDanger, $scope.label.errorResults, status, data);
	            });

			Clientes.query({ query: { } })
				.success(function(data) { $scope.Clientes = angular.copy(data.instanceList); })
				.error(function(data, status) {
					$scope.showMessage(true, $scope.messageAlertDanger, $scope.label.errorResults, status, data);
	            });

	        Users.query({ query: { } })
				.success(function(data) { $scope.Usuarios = angular.copy(data.instanceList); })
				.error(function(data, status) {
					$scope.showMessage(true, $scope.messageAlertDanger, $scope.label.errorResults, status, data);
	            });

	        Fichas.query({ query: { } })
				.success(function(data) { $scope.Fichas = angular.copy(data.instanceList); })
				.error(function(data, status) {
					$scope.showMessage(true, $scope.messageAlertDanger, $scope.label.errorResults, status, data);
	            });

	        Facturas.query({ query: { } })
				.success(function(data) { $scope.Facturas = angular.copy(data.instanceList); })
				.error(function(data, status) {
					$scope.showMessage(true, $scope.messageAlertDanger, $scope.label.errorResults, status, data);
	            });
		};

		

		$scope.getDataReporte = function() {
			if($scope.formData.reporte._id){
				//Buscar el programa seleccionado dentro de la lista de programas para obtener datos
		        var reporte = _.find($scope.Reportes, function(reporte){ return reporte._id == $scope.formData.reporte._id && reporte.estado == 'Activo' ; });
		        console.log(reporte);
		        $scope.formData.reporte = angular.copy(reporte);
		        $scope.showHideFiltros();
		    }
		};

		$scope.showHideFiltros = function(){
			$scope.filtros = {};
			_.each($scope.formData.reporte.filtros, function(value, filtro){
				$scope.filtros[filtro] = true;
			});
		};

		$scope.getPdf = function(descargar) {
			if($scope.formData.reporte._id)
				Reportes.getReporteById(angular.copy($scope.formData.reporte), $scope.formTemp, descargar);
		}

		$scope.showMessage = function(show,type,message,status,data) {
			$scope.messageShow = show;
			$scope.messageClass = type;
			$scope.messageText = message;
			if(status){
				console.log('Error: ' + status);
	        	console.log(data);
			}
		};

	}]);