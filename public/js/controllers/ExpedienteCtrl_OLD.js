angular.module('ExpedienteCtrl', ['ngMessages'/*,'btford.socket-io'*/])
	//NUEVO
	/*
	.factory('Socket', ['socketFactory',
	    function(socketFactory) {
	    	return socketFactory();
	    }
	])
	.factory('_',['$window', function($window){
            return $window._;
        }])
	*/
	//NUEVO

	// inject the Expediente service factory into our controller
	.controller('ExpedienteController', ['$scope','$routeParams','$location','$http','Expedientes','$filter', /*'Socket',*/ function($scope, $routeParams, $location, $http, Expedientes, $filter /*, Socket*/) {
		//$scope.formData = {};
		$scope.searchData = {};
		$scope.estado_civiles = ['Casado(a)','Divorciado(a)','Soltero(a)','Union Libre','Viudo(a)'];
		$scope.escolaridades = ['Ninguna','Primaria','Secundaria','Preparatoria','Licenciatura','Posgrado'];
		$scope.tipo_relaciones_sexuales = ['Heterosexual','Homosexual','Bisexual'];
		$scope.buena_regular_mala = ['Buena','Regular','Mala'];
		$scope.si_no = ['Si','No'];
		$scope.formData = {sexo:'Hombre'};
		
		$scope.loading = true;
		$scope.expedientes = [];


		$scope.messageShow = false;
		$scope.messageClass = "";
		$scope.messageText = '';


		//USADOS POR DATEPICKER
		$scope.popup1 = { opened: false };
		$scope.popup2 = { opened: false };
		$scope.popup3 = { opened: false };
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
  				case 2:
  					$scope.popup2.opened = true;
	  				break;
  				case 3:
  					$scope.popup3.opened = true;
	  				break;
	  		}
		};



		console.log($routeParams.expedienteId);
		
		// GET =====================================================================
		// when landing on the page, get all devices and show them
		// use the service to get all the devices

		$scope.inicio = function(){
			Expedientes.get()
				.success(function(data) {
					$scope.expedientes = angular.copy(data);
					$scope.loading = false;
					console.log(data);
				})
			;
		}

		
		$scope.searchExpediente = function(){
			if($scope.searchData.data != undefined && $scope.searchData.data != ''){
				Expedientes.search($scope.searchData)
					.success(function(data) {
						$scope.expedientes = {};
						$scope.expedientes = angular.copy(data);
					})
					.error(function(data, status) {
						console.log("Error en la busqueda de expedientes");
						$location.path('/expedientes');
		            })
					;
			}
		}
		

		$scope.getExpediente = function(){
			//console.log($routeParams);
			if($routeParams.expedienteId != undefined){
				Expedientes.findById($routeParams.expedienteId)
					.success(function(data) {
						$scope._id = $routeParams.expedienteId;
						$scope.formData = angular.copy(data);
						$scope.formData.fecha_nacimiento = new Date($scope.formData.fecha_nacimiento);
						//console.log(data);
					})
					.error(function(data, status) {
						console.log("No se encontró expediente");
						$location.path('/expedientes');
		            })
					;
			}
			console.log($scope._id);
		}


		// CREATE ==================================================================
		// when submitting the add form, send the text to the node API
		$scope.createOrUpdateExpediente = function(isValid, _id) {
			//console.log($scope.formData);
			$scope.messageShow = false;
			$scope.messageClass = "";
			$scope.messageText = '';
			$scope.formData.estado = "Activo";

			// Valida formData, si el #Dispositivo y el Nombre estan asiganaods, crea el registro
			if (isValid) {

				$scope.loading = true;

				if(_id != undefined) {
					//UPDATE
					Expedientes.update(_id,$scope.formData)
						.success(function(data) {
							$scope.formData = {};
							console.log("Registro actualizado con exito");
							$location.path('/expedientes');
						})
						.error(function(data, status) {
							$scope.messageShow = true;
							$scope.messageClass = "alert-danger";
					        $scope.message = data || "Request failed";
							console.log("Datos invalidos: "+status+" - "+$scope.message);
			            })
						;
				} else {
					//CREATE
					// call the create function from our service (returns a promise object)
					Expedientes.create($scope.formData)
						.success(function(data) {
							$scope.formData = {};
							console.log("Registro insertado con exito");
							$location.path('/expedientes');
						})
						.error(function(data, status) {
							$scope.messageShow = true;
							$scope.messageClass = "alert-danger";
					        $scope.message = data || "Request failed";
							console.log("Datos invalidos: "+status+" - "+$scope.message);
			            })
						;
				}
			} else {
				$scope.loading = false;
				//$scope.status = 0;
				$scope.messageShow = true;
				$scope.messageClass = "alert-danger";
		        $scope.messageText = "Rellene los datos correctamente";
				console.log("Datos invalidos: "+$scope.message);
			}
		};

		// DELETE ==================================================================
		// Delete Method
		$scope.deleteExpediente = function(_id,id) {
			$scope.loading = true;

			Expedientes.delete(_id)
				/*
				// if successful creation, call our get function to get all the new devices
				.success(function(data) {
					$scope.loading = false;
					$scope.devices = data; // assign our new list of devices
					Socket.emit("led:deleted"); //Envio la funcion al socket
					Socket.emit('led:off',{pin: id}); //Al eliminar mando a apagar el dispositivo
				})
				*/
				;
		};

		// Update ==================================================================
		// Update Method
		$scope.updateExpediente = function(_id,id) {
			//$scope.loading = true; //COMENTAR AL GUSTO
			//Valida formData, si el #Dispositivo y el Nombre estan asiganaods, crea el registro
			if (_id != undefined && _id != '') {
				//Validamos los campos del formulario
				//$scope.formData.nombre = nombre; //Asignamos el disposito para que no se cambie de pin
				$scope.formData.nombre = ($scope.formData.nombre!=undefined)?$scope.formData.nombre:'';
				$scope.formData.apPaterno = ($scope.formData.apPaterno!=undefined)?$scope.formData.apPaterno:'';
				$scope.formData.apaMaterno = ($scope.formData.apaMaterno!=undefined)?$scope.formData.apaMaterno:'';
				$scope.formData.edad = ($scope.formData.edad!=undefined)?$scope.formData.edad:'';
				$scope.formData.estado_civil = ($scope.formData.estado_civil!=undefined)?$scope.formData.estado_civil:'';

				//Actualizamos
            	Expedientes.update(_id,$scope.formData)
            		/*
					// if successful creation, call our get function to get all the new devices
					.success(function(data) {
						$scope.loading = false;
						$scope.formData = {}; // clear the form so our user is ready to enter another
						$scope.devices = data; // assign our new list of devices
						Socket.emit("led:updated"); //Envio la funcion al socket
					})
					*/
					;
			}

		};




		// JOHNNY FIVE - SOCKET.IO - METHODS =========================================
		/*
		$scope.changeStatus = function(_id,id,name,status) {
			//$scope.loading = true; //Aparece loading //COMENTAR AL GUSTO
			var intStatus = (status==1) ? 0 : 1;
			var strStatus = (status==1) ? 'off' : 'on'; //Si esta ON, manda OFF y viceversa
			var strEmit = 'led:'+strStatus;	
			if (id != undefined ) {
            	//Actualizamos
            	$scope.formData.status = intStatus; //Nuevo valor de estado
            	Expedientes.update(_id,$scope.formData)

					// if successful creation, call our get function to get all the new devices
					.success(function(data) {
						$scope.loading = false;
						$scope.formData = {}; // clear the form so our user is ready to enter another
						$scope.devices = data; // assign our new list of devices
						Socket.emit(strEmit,{pin: id}); //Envio la funcion al socket
            			console.log(strEmit);
					});
			}
		};

		Socket.on('led:change', function(dataS) {
			Expedientes.get()
			.success(function(data) {
				$scope.devices = data;
				$scope.loading = false;

				//Calcular pines disponibles
				$scope.usedPins = [];
				angular.forEach(data, function(dev, key) {
			  		this.push(dev.id);
				}, $scope.usedPins);
				$scope.aviablePins = _.difference( $scope.totalPins, $scope.usedPins);
			});
		    console.log("Led:"+dataS.pin+", stat:"+dataS.stat+", actualizado");
		});

		//Cuando se crea o elimina algun dispositivo, los metodos de crear y eliminar, emiten al socket
		//una confirmacion de la accion, el server recibe esta confirmacion y manda a refrescar
		// a todos los clientes, cada cliente recibe la orden de refrescar y recarga los dispositivos de la BD
		Socket.on('led:refresh', function() {
			Expedientes.get()
			.success(function(data) {
				$scope.devices = data;
				$scope.loading = false;

				//Calcular pines disponibles
				$scope.usedPins = [];
				angular.forEach(data, function(dev, key) {
			  		this.push(dev.id);
				}, $scope.usedPins);
				$scope.aviablePins = _.difference( $scope.totalPins, $scope.usedPins);
			});
		    console.log("Led:REFRESH");
		});
		*/

	}]);



	