angular.module('DoctorCtrl',[])

	.controller('DoctorController', ['$scope','$routeParams','$location','Doctores','Especialidades', function($scope, $routeParams, $location, Doctores, Especialidades) {
		$scope.controlNameSingular = 'Doctor';
		$scope.controlNamePlural = 'Doctores';
		$scope.controllerInstance = 'doctores';

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
		$scope.label.management = 'Administración';

		$scope.messageShow = false;
		$scope.messageClass = "";
		$scope.messageText = '';
		$scope.messageAlertSuccess = 'alert-success';
		$scope.messageAlertInfo = 'alert-info';
		$scope.messageAlertDanger = 'alert-danger';

		$scope.searchData = {};
		$scope.formData = {estado:'Activo'};

		$scope.instanceList = [];
		$scope.Especialidades = [];
		
		$scope.totalItems = 0;
		$scope.currentPage = 1;
		$scope.itemsPerPage = 5;
		$scope.textPagination = '';

		$scope.model = { 
						apPaterno: 'Apellido Paterno',
						apMaterno: 'Apellido Materno',
						nombre: 'Nombre',
						telefono: 'Telefono',
						email: 'Email',
					    fecha_alta: 'Fecha de alta',
					    especialidades: 'Especialidades',
					    estado: 'Estado'
					};

		$scope.inicio = function(){
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
    		query.sort = {};
			$scope.query(query);
		}


		$scope.query = function(query){
			Doctores.query(query)
				.success(function(data) {
					$scope.instanceList = angular.copy(data.instanceList);
					$scope.totalItems = data.totalItems;
					$scope.calculateTextPagination();
					if($scope.searchData.active){
						$scope.messageShow = true;
						$scope.messageClass = $scope.messageAlertInfo;
						$scope.messageText = $scope.label.searchResults+' "'+$scope.searchData.data+'"... ';
					}
					
				})
				.error(function(data, status) {
					$scope.messageShow = true;
					$scope.messageClass = $scope.messageAlertDanger;
					$scope.messageText = $scope.label.errorResults;
			        console.log('Error: ' + status);
			        console.log(data);
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
			Especialidades.query({ query: { estado: 'Activo' } })
				.success(function(data) {
					$scope.Especialidades = angular.copy(data.instanceList);
					console.log(data);
				})
				.error(function(data, status) {
					$scope.messageShow = true;
					$scope.messageClass = $scope.messageAlertDanger;
					$scope.messageText = $scope.label.errorResults;
					console.log('Error: ' + status);
			        console.log(data);
	            })
			;

			$scope.label.createOrEdit = $scope.label.add;
			if($routeParams.instanceId != undefined){
				Doctores.findById($routeParams.instanceId)
					.success(function(data) {
						$scope._id = $routeParams.instanceId;
						$scope.formData = angular.copy(data);
						$scope.label.createOrEdit = $scope.label.edit;
					})
					.error(function(data, status) {
						console.log($scope.label.noFindRow);
						$location.path('/'+$scope.controllerInstance);
		            })
					;
			}
		}


		$scope.createOrUpdate = function(isValid, _id) {
			$scope.messageShow = false;
			$scope.messageClass = "";
			$scope.messageText = '';

			//Valida formData
			if (isValid) {
				
				if(_id != undefined) {
					Doctores.update(_id,$scope.formData)
						.success(function(data) {
							$scope.formData = {};
							console.log($scope.label.updateSuccess);
							$location.path('/'+$scope.controllerInstance);

							//COMO ENVIAR ALERTA?							
							$scope.messageShow = true;
							$scope.messageClass = $scope.messageAlertSuccess;
							$scope.messageText = $scope.label.updateSuccess;

						})
						.error(function(data, status) {
							$scope.messageShow = true;
							$scope.messageClass = $scope.messageAlertDanger;
							$scope.messageText = $scope.label.updateFailed;
					        console.log('Error: ' + status);
					        console.log(data);
			            })
						;
				} else {
					Doctores.create($scope.formData)
						.success(function(data) {
							$scope.formData = {};
							console.log($scope.label.createSuccess);
							$location.path('/'+$scope.controllerInstance);

							//COMO ENVIAR ALERTA?							
							$scope.messageShow = true;
							$scope.messageClass = $scope.messageAlertSuccess;
							$scope.messageText = $scope.label.createSuccess;

						})
						.error(function(data, status) {
							$scope.messageShow = true;
							$scope.messageClass = $scope.messageAlertDanger;
							$scope.messageText = $scope.label.createFailed;
					        console.log('Error: ' + status);
					        console.log(data);
			            })
						;
				}
			} else {
				$scope.messageShow = true;
				$scope.messageClass = $scope.messageAlertDanger;
		        $scope.messageText = $scope.label.invalidDataForm;
			}
		};

		$scope.delete = function(_id) {
			//Doctores.delete(_id);
		};

	}]);