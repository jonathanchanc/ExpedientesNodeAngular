angular.module('RevisionCtrl', [])
	
	.controller('RevisionController', ['$rootScope','$scope','$routeParams','$location','Main','Revisiones','Expedientes','Oficinas', function($rootScope, $scope, $routeParams, $location, Main, Revisiones, Expedientes, Oficinas) {
		$scope.controlNameSingular = 'Revision';
		$scope.controlNamePlural = 'Revisiones';
		$scope.controllerInstance = 'revisiones';

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
		$scope.label.duplicatedEntry = 'El nombre del registro ya existe';
		$scope.label.updateSuccess = 'Registro actualizado con éxito';
		$scope.label.updateFailed = 'Error al actualizar';
		$scope.label.paginationShowing = 'Mostrando resultados';
		$scope.label.paginationTo = '-';
		$scope.label.paginationFrom = 'de';
		$scope.label.active = 'Activo';
		$scope.label.inactive = 'Inactivo';
		$scope.label.back = 'Regresar';

		$scope.messageShow = false;
		$scope.messageClass = "";
		$scope.messageText = '';
		$scope.messageAlertSuccess = 'alert-success';
		$scope.messageAlertInfo = 'alert-info';
		$scope.messageAlertDanger = 'alert-danger';
		
		$scope.searchData = {};
		$scope.estado_civiles = ['Casado(a)','Divorciado(a)','Soltero(a)','Union Libre','Viudo(a)'];
		$scope.escolaridades = ['Ninguna','Primaria','Secundaria','Preparatoria','Licenciatura','Posgrado'];
		$scope.tipo_relaciones_sexuales = ['Heterosexual','Homosexual','Bisexual'];
		$scope.buena_regular_mala = ['Buena','Regular','Mala'];
		$scope.si_no = ['Si','No'];

		$scope.formTemp = { usuario_modifico: { oficina: {} } };
		$scope.formDataExpediente = { };
		$scope.formData = { estado:'Activo', expediente:{}, usuario: { oficina: {} }, };
		
		$scope.instanceList = [];
		$scope.Revisiones = []

		$scope.totalItems = 0;
		$scope.currentPage = 1;
		$scope.itemsPerPage = 20;
		$scope.textPagination = '';

		$scope.model = { 
						numero_expediente:					'#Expediente',
						apPaterno:							'Apellido paterno',
						apMaterno:							'Apellido materno',
						nombre:								'Nombre',
						telefono:							'Telefono',
						email:								'Email',
						edad: 								'Edad',							
						sexo:								'Sexo',
						peso:								'Peso',
						talla:								'Talla',
						ta:									'T/A',
						pulso:								'Pulso',
						lugar_nacimiento:					'Lugar de nacimiento',
						fecha_nacimiento:					'Fecha de nacimiento',
						estado_civil:						'Estado civil',
						escolaridad:						'Escolaridad',
						religion:							'Religión',
						sedentarismo:						'Sedentarismo',
						tipo_relaciones_sexuales:			'Tipo de relaciones sexuales',
						parejas_sexuales:					'#Parejas sexuales',
						alimentacion:						'Alimentacion',
						habitacion: 						'Habitación',
						higiene: 							'Higiene',
						ocupacion: 							'Ocupación',
						tabaquismo: 						'Tabaquismo',
						alcoholismo: 						'Alcoholismo',
						quirurgicos: 						'Quirurgicos',
						traumaticos: 						'Traumaticos',
						alergicos: 							'Alergicos',
						transfusion: 						'Transfusión',
						enfermedades_infecto_contagiosas:	'Enfermedades infecto contagiosas',
						diabeticos: 						'Diabeticos',
						oncologicos: 						'Oncologicos',
						congenitos: 						'Congenitos',
						enfermedades_degenerativas: 		'Enfermedades degenerativas',
						otros_hereditarios: 				'Otros hereditarios',
						menarca: 							'Menarca',
						ritmo: 								'Ritmo',
						ivsa: 								'Ivsa',
						fur: 								'F.U.R',
						epe: 								'E.P.E',
						embarazos: 							'Embarazos',
						partos: 							'Partos',
						abortos: 							'Abortos',
						cesareas: 							'Cesareas',
						mpf: 								'mpf',
						lactancia: 							'Lactancia',
						fue: 								'F.U.E',
						numero_hijos: 						'Numero de hijos',
						estado: 							'Estado',
						revision: 							'Revision'
					};


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

		//USADO POR ACORDEON  PANEL
		$scope.panels = {
			open1: true,
			open2: false,
			open3: false,
			open4: false,
			open5: true,
			open6: false,
		}
		$scope.oneAtATime = false;

		$scope.groups = [
			{
			  title: 'Dynamic Group Header - 1',
			  content: 'Dynamic Group Body - 1'
			},
			{
			  title: 'Dynamic Group Header - 2',
			  content: 'Dynamic Group Body - 2'
			}
		];
		//USADO POR ACORDEON  PANEL

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
					  				{ nombre: { $regex : data, $options:"i" } },
					  				{ apPaterno: { $regex : data, $options:"i" } },
					  				{ apMaterno: { $regex : data, $options:"i" } },
					  				//{descripcion: { $regex : data, $options:"i" } },
					  				]
					  			};

				//Check if data is number https://stackoverflow.com/questions/1303646/check-whether-variable-is-number-or-string-in-javascript
				if(!isNaN(parseFloat($scope.searchData.data)) && !isNaN($scope.searchData.data - 0)){
					query.query['$or'].push({ 'numero_expediente' : $scope.searchData.data })
				}

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
			Expedientes.query(query)
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
			$scope.label.createOrEdit = $scope.label.add;
			//Revisamos parametro 'expedienteID'
			if($routeParams.expedienteId != undefined){
				Expedientes.findById($routeParams.expedienteId)
					.success(function(data) {
						//$scope._id = $routeParams.instanceId;
						$scope.formDataExpediente = angular.copy(data);
						$scope.formDataExpediente.fecha_nacimiento = new Date($scope.formDataExpediente.fecha_nacimiento);
						$scope.formData.expediente = $scope.formDataExpediente._id;
					})
					.error(function(data, status) {
						$scope.showMessage(true,$scope.messageAlertDanger,$scope.label.noFindRow,status,data);
						$location.path('/'+$scope.controllerInstance);
		            })
					;

				Revisiones.query({ query: { expediente: $scope.formDataExpediente._id, estado: 'Activo' } })
				.success(function(data) { 
					$scope.Revisiones = angular.copy(data.instanceList); 
				})
				.error(function(data, status) {
					$scope.showMessage(true, $scope.messageAlertDanger, $scope.label.errorResults, status, data);
	            });

			}			

			//Rervision normal de parametro instanceId
			/*
			if($routeParams.instanceId != undefined){
				Revisiones.findById($routeParams.instanceId)
					.success(function(data) {
						$scope._id = $routeParams.instanceId;
						$scope.formData = angular.copy(data);
						$scope.label.createOrEdit = $scope.label.edit;
						$scope.formData.fecha_nacimiento = new Date($scope.formData.fecha_nacimiento);
					})
					.error(function(data, status) {
						$scope.showMessage(true,$scope.messageAlertDanger,$scope.label.noFindRow,status,data);
						$location.path('/'+$scope.controllerInstance);
		            })
					;
			}
			*/

			Main.me(
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

								Revisiones.findById($routeParams.instanceId)
									.success(function(dataRevision) {
										$scope._id = $routeParams.instanceId;
										$scope.formData = angular.copy(dataRevision);
										$scope.label.createOrEdit = '';
										$scope.label.other = dataRevision.folio_ficha;
										//AGregamos usuario modifico
										dataOficina = dataOficina.instanceList[0];
										$scope.formTemp.usuario_modifico._id = userData.data._id;
										$scope.formTemp.usuario_modifico.usuario = userData.data.usuario;
										$scope.formTemp.usuario_modifico.nombre = userData.data.nombre_completo;
										$scope.formTemp.usuario_modifico.oficina._id = dataOficina._id;
										$scope.formTemp.usuario_modifico.oficina.nombre = dataOficina.nombre;
										//$scope.formData.usuario_modifico = $scope.formTemp.usuario_modifico;
									})
									.error(function(dataRevision, status) {
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
					Revisiones.update(_id,$scope.formData)
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
							$scope.showMessage(true, $scope.messageAlertDanger, $scope.label.updateFailed, status, data);
			            })
						;
				} else {
					$scope.formData.usuario.fecha = new Date(); //Fecha creacion
					Revisiones.create($scope.formData)
						.success(function(data) {
							$scope.formData = {};
							console.log($scope.label.createSuccess);
							$location.path('/'+$scope.controllerInstance);
							
							//Opcional en lugar de $location.path('/'+$scope.controllerInstance);
							//$scope.get();
							//$scope.showMessage(true, $scope.messageAlertSuccess, $scope.label.createSuccess, status, data);
							//No funcona correctamente, boton se bloquea REVISAR


							//COMO ENVIAR ALERTA?							
							//$scope.messageShow = true;
							//$scope.messageClass = $scope.messageAlertSuccess;
							//$scope.messageText = $scope.label.createSuccess;
						})
						.error(function(data, status) {
							$scope.showMessage(true, $scope.messageAlertDanger, $scope.label.createFailed, status, data);
			            })
						;
				}
			} else {
				$scope.showMessage(true, $scope.messageAlertDanger, $scope.label.invalidDataForm);
			}
		};

		$scope.delete = function(_id) {
			//Revisiones.delete(_id);
		};

		$scope.showMessage = function(show,type,message,status,data) {
			$scope.formTemp.lockButtonSave = false;
			$scope.messageShow = show;
			$scope.messageClass = type;
			$scope.messageText = message;

			//Manejo de Mensajes de Mongo
			if(_.has(data, 'code')){
				if(data.code == 11000)
					$scope.messageText = $scope.label.duplicatedEntry;
			}

			if(status){
				console.log('Error: ' + status);
	        	console.log(data);
			}
		};



	}]);



	