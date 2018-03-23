angular.module('UserCtrl',[])

	.controller('UserController', ['$rootScope','$scope','$routeParams','$location','$localStorage','Users','Oficinas','Roles', 'Main', function($rootScope, $scope, $routeParams, $location, $localStorage, Users, Oficinas, Roles, Main) {
		$scope.controlNameSingular = 'Usuario';
		$scope.controlNamePlural = 'Usuarios';
		$scope.controllerInstance = 'users';

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
		$scope.label.management = 'Administración';
		$scope.label.resetPassword = 'Reiniciar Constraseña';

		$scope.messageShow = false;
		$scope.messageClass = "";
		$scope.messageText = '';
		$scope.messageAlertSuccess = 'alert-success';
		$scope.messageAlertInfo = 'alert-info';
		$scope.messageAlertDanger = 'alert-danger';

		$scope.searchData = {};
		$scope.formData = {estado:'Activo'};
		$scope.formTemp = {};

		$scope.instanceList = [];
		$scope.Oficinas = [];
		$scope.Roles = [];
		
		$scope.totalItems = 0;
		$scope.currentPage = 1;
		$scope.itemsPerPage = 5;
		$scope.textPagination = '';

		$scope.model = {
						usuario: 'Usuario',
						password: 'Constraseña',
						token: 'Token',
						titulo: 'Titulo',
						siglas: 'Siglas',
						apPaterno: 'Apellido Paterno',
						apMaterno: 'Apellido Materno',
						nombre: 'Nombre',
						telefono: 'Telefono',
						email: 'Email',
					    fecha_alta: 'Fecha de alta',
					    estado: 'Estado',
					    oficina: 'Oficina',
					    rol: 'Rol'
					};

		/*
		$scope.token = $localStorage.token;
		$scope.privilegios = angular.copy($localStorage.privilegios);
		//console.log($localStorage.token);
		console.log($localStorage.privilegios);
		//console.log($scope.token);
		console.log($scope.privilegios);
		*/
	
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
					  				{apPaterno: { $regex : data, $options:"i" } },
					  				{apMaterno: { $regex : data, $options:"i" } },
					  				{nombre: 	{ $regex : data, $options:"i" } },
					  				{telefono: 	{ $regex : data, $options:"i" } },
					  				{email: 	{ $regex : data, $options:"i" } },
					  				]
					  			};
			} else {
				$scope.searchData.active = false;
				$scope.messageShow = false;
	  			query.query = {};
			}
			
			query.limit = $scope.itemsPerPage;
    		query.page = $scope.currentPage-1;
    		query.sort = { usuario: 1 };
			$scope.query(query);
		}


		$scope.query = function(query){
			Users.query(query)
				.success(function(data) {
					$scope.instanceList = angular.copy(data.instanceList);
					$scope.totalItems = data.totalItems;
					$scope.calculateTextPagination();
					if($scope.searchData.active){
						$scope.showMessage(true, $scope.messageAlertInfo, $scope.label.searchResults+' "'+$scope.searchData.data+'"... ');
					}
				})
				.error(function(data, status) {
					$scope.showMessage(true,$scope.messageAlertDanger,$scope.label.errorResults,status,data);
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
				.success(function(data) {
					$scope.Oficinas = angular.copy(data.instanceList);
					//console.log(data);
				})
				.error(function(data, status) {
					$scope.showMessage(true,$scope.messageAlertDanger,$scope.label.errorResults,status,data);
	            })
			;

			Roles.query({ query: { estado: 'Activo' } })
				.success(function(data) {
					$scope.Roles = angular.copy(data.instanceList);
					//console.log(data);
				})
				.error(function(data, status) {
					$scope.showMessage(true,$scope.messageAlertDanger,$scope.label.errorResults,status,data);
	            })
			;


			$scope.label.createOrEdit = $scope.label.add;
			if($routeParams.instanceId != undefined){
				Users.findById($routeParams.instanceId)
					.success(function(data) {
						$scope.formTemp.statusEditable = true; //Campos de activo y usurio creo
						$scope._id = $routeParams.instanceId;
						$scope.formData = angular.copy(data);
						delete $scope.formData.token;
						$scope.label.createOrEdit = $scope.label.edit;
					})
					.error(function(data, status) {
						$scope.showMessage(true,$scope.messageAlertDanger,$scope.label.noFindRow,status,data);
						$location.path('/'+$scope.controllerInstance);
		            })
					;
			}
		}


		$scope.createOrUpdate = function(isValid, _id) {
			$scope.formTemp.lockButtonSave = true;
			$scope.messageShow = false;
			$scope.messageClass = "";
			$scope.messageText = '';

			//Valida formData
			if (isValid) {
				
				if(_id != undefined) {
					Users.update(_id,$scope.formData)
						.success(function(data) {
							$scope.formData = {};
							console.log($scope.label.updateSuccess);
							$location.path('/'+$scope.controllerInstance);

							//COMO ENVIAR ALERTA?
							$scope.showMessage(true,$scope.messageAlertSuccess,$scope.label.updateSuccess);
						})
						.error(function(data, status) {
							$scope.showMessage(true,$scope.messageAlertDanger,$scope.label.updateFailed,status,data);
			            })
						;
				} else {
					Users.create($scope.formData)
						.success(function(data) {
							$scope.formData = {};
							console.log($scope.label.createSuccess);
							$location.path('/'+$scope.controllerInstance);

							//COMO ENVIAR ALERTA?
							$scope.showMessage(true,$scope.messageAlertSuccess,$scope.label.createSuccess);
						})
						.error(function(data, status) {
							$scope.showMessage(true,$scope.messageAlertDanger,$scope.label.createFailed,status,data);
			            })
						;
				}
			} else {
				$scope.showMessage(true,$scope.messageAlertDanger,$scope.label.invalidDataForm);
			}
		};

		$scope.changePassword = function() {
	        $scope.formTemp.lockButtonSave = true;
	        $scope.messageShow = false;
	        $scope.messageClass = "";
	        $scope.messageText = '';

	        //Valida formData
	        if ($scope.formData.password != undefined && 
	        	$scope.formData.password.length >= 6 && $scope.formData.password.length <= 25) {
	            //Solo acepta letras y numeros
	            // /^[a-z0-9]+$/i
	            // ^         start of string
	            // [a-z0-9]  a or b or c or ... z or 0 or 1 or ... 9
	            // *         zero or more times
	            // $         end of string
	            // /i        case-insensitive
	            if ( ( /^[a-z0-9]*$/i.test($scope.formData.password) ) == true ){
                	var data = { password: $scope.formData.password };
                    Users.changePassword($scope._id,data)
                        .success(function(data) {
                            $scope.formData = {};
							console.log('Password actuaizado');
							$location.path('/'+$scope.controllerInstance);
                            
                            //COMO ENVIAR ALERTA?                           
                            $scope.showMessage(true,$scope.messageAlertSuccess,'Password actuaizado');
                        })
                        .error(function(data, status) {
                            $scope.showMessage(true,$scope.messageAlertDanger,'Error al actualizar',status,data);
                        });
	            } else {
	                $scope.showMessage(true,$scope.messageAlertDanger,'Solo se aceptan letras y números');       
	            }
	        } else {
	            $scope.showMessage(true,$scope.messageAlertDanger,'Rellene los datos correctamente');
	        }
	    };

		$scope.delete = function(_id) {
			//Users.delete(_id);
		};

		$scope.showMessage = function(show,type,message,status,data) {
			$scope.formTemp.lockButtonSave = false;
			$scope.messageShow = show;
			$scope.messageClass = type;
			$scope.messageText = message;
			if(status){
				console.log('Error: ' + status);
	        	console.log(data);	
			}
			angular.element('#alertMessage').focus();
		};

	}]);