angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', '$httpProvider', function($routeProvider, $locationProvider, $httpProvider) {

	$routeProvider

		// home page
		.when('/', {
			templateUrl: 'views/home.html',
			controller: 'MainController'
		})


        //CONSULTAS --------------------------
        //Expedientes
		.when('/expedientes', {
			templateUrl: 'views/expediente/list.html',
			controller: 'ExpedienteController'
		})

		.when('/expedientes/create', {
			templateUrl: 'views/expediente/form.html',
			controller: 'ExpedienteController'
		})

		.when('/expedientes/update/:instanceId', {
			templateUrl: 'views/expediente/form.html',
			controller: 'ExpedienteController'
		})

        //REvisiones
        .when('/revisiones', {
            templateUrl: 'views/revision/list.html',
            controller: 'RevisionController'
        })

        .when('/revisiones/create', {
            templateUrl: 'views/revision/form.html',
            controller: 'RevisionController'
        })

        .when('/revisiones/create/:expedienteId', {
            templateUrl: 'views/revision/form.html',
            controller: 'RevisionController'
        })

        .when('/revisiones/update/:instanceId', {
            templateUrl: 'views/revision/form.html',
            controller: 'RevisionController'
        })
       

        //CONTABILIDAD --------------------------
        //Ficha
        .when('/fichas', {
            templateUrl: 'views/ficha/list.html',
            controller: 'FichaController'
        })

        .when('/fichas/create', {
            templateUrl: 'views/ficha/form.html',
            controller: 'FichaController'
        })

        .when('/fichas/update/:instanceId', {
            templateUrl: 'views/ficha/form.html',
            controller: 'FichaController'
        })

         //Factura
        .when('/facturas', {
            templateUrl: 'views/factura/list.html',
            controller: 'FacturaController'
        })

        .when('/facturas/create', {
            templateUrl: 'views/factura/form.html',
            controller: 'FacturaController'
        })

        .when('/facturas/update/:instanceId', {
            templateUrl: 'views/factura/form.html',
            controller: 'FacturaController'
        })

        //Egreso
        .when('/egresos', {
            templateUrl: 'views/egreso/list.html',
            controller: 'EgresoController'
        })

        .when('/egresos/create', {
            templateUrl: 'views/egreso/form.html',
            controller: 'EgresoController'
        })

        .when('/egresos/update/:instanceId', {
            templateUrl: 'views/egreso/form.html',
            controller: 'EgresoController'
        })

        //REPORTES --------------------------
        //Reporte
        .when('/reportes', {
            templateUrl: 'views/reporte/list.html',
            controller: 'ReporteController'
        })

        //ADMINISTRACION --------------------------
        //Oficina
        .when('/oficinas', {
            templateUrl: 'views/oficina/list.html',
            controller: 'OficinaController'
        })

        .when('/oficinas/create', {
            templateUrl: 'views/oficina/form.html',
            controller: 'OficinaController'
        })

        .when('/oficinas/update/:instanceId', {
            templateUrl: 'views/oficina/form.html',
            controller: 'OficinaController'
        })

        //Especialidad
        .when('/especialidades', {
            templateUrl: 'views/especialidad/list.html',
            controller: 'EspecialidadController'
        })

        .when('/especialidades/create', {
            templateUrl: 'views/especialidad/form.html',
            controller: 'EspecialidadController'
        })

        .when('/especialidades/update/:instanceId', {
            templateUrl: 'views/especialidad/form.html',
            controller: 'EspecialidadController'
        })

        //Programa
        .when('/programas', {
            templateUrl: 'views/programa/list.html',
            controller: 'ProgramaController'
        })

        .when('/programas/create', {
            templateUrl: 'views/programa/form.html',
            controller: 'ProgramaController'
        })

        .when('/programas/update/:instanceId', {
            templateUrl: 'views/programa/form.html',
            controller: 'ProgramaController'
        })

         //Doctor
         /*
        .when('/doctores', {
            templateUrl: 'views/doctor/list.html',
            controller: 'DoctorController'
        })

        .when('/doctores/create', {
            templateUrl: 'views/doctor/form.html',
            controller: 'DoctorController'
        })

        .when('/doctores/update/:instanceId', {
            templateUrl: 'views/doctor/form.html',
            controller: 'DoctorController'
        })
        */

        //Proveedor
        .when('/proveedores', {
            templateUrl: 'views/proveedor/list.html',
            controller: 'ProveedorController'
        })

        .when('/proveedores/create', {
            templateUrl: 'views/proveedor/form.html',
            controller: 'ProveedorController'
        })

        .when('/proveedores/update/:instanceId', {
            templateUrl: 'views/proveedor/form.html',
            controller: 'ProveedorController'
        })

         //Cliente
        .when('/clientes', {
            templateUrl: 'views/cliente/list.html',
            controller: 'ClienteController'
        })

        .when('/clientes/create', {
            templateUrl: 'views/cliente/form.html',
            controller: 'ClienteController'
        })

        .when('/clientes/update/:instanceId', {
            templateUrl: 'views/cliente/form.html',
            controller: 'ClienteController'
        })

        //SEGURIDAD ---------------------------------
        //Pivilegios
        .when('/privilegios', {
            templateUrl: 'views/privilegio/list.html',
            controller: 'PrivilegioController'
        })

        .when('/privilegios/create', {
            templateUrl: 'views/privilegio/form.html',
            controller: 'PrivilegioController'
        })

        .when('/privilegios/update/:instanceId', {
            templateUrl: 'views/privilegio/form.html',
            controller: 'PrivilegioController'
        })

         //Rol
        .when('/roles', {
            templateUrl: 'views/rol/list.html',
            controller: 'RolController'
        })

        .when('/roles/create', {
            templateUrl: 'views/rol/form.html',
            controller: 'RolController'
        })

        .when('/roles/update/:instanceId', {
            templateUrl: 'views/rol/form.html',
            controller: 'RolController'
        })

        //User
        .when('/users', {
            templateUrl: 'views/user/list.html',
            controller: 'UserController'
        })

        .when('/users/create', {
            templateUrl: 'views/user/form.html',
            controller: 'UserController'
        })

        .when('/users/update/:instanceId', {
            templateUrl: 'views/user/form.html',
            controller: 'UserController'
        })

		
		////pendiente de cambio de  nombre -----------------------
		.when('/signin', {
            templateUrl: 'views/main/signin.html',
            controller: 'MainController'
        })
        // .when('/signup', {
        //     templateUrl: 'views/main/signup.html',
        //     controller: 'MainController'
        // })
        .when('/me', {
            templateUrl: 'views/main/detail.html',
            controller: 'MainController'
        })
        .otherwise({
            redirectTo: '/'
        })
		//-----------------------
		;

	$locationProvider.html5Mode(true);

	//Interceptor - adds the token to the header
	$httpProvider.interceptors.push(['$q', '$location', '$localStorage', function($q, $location, $localStorage) {
        return {
            'request': function (config) {
                config.headers = config.headers || {};
                if ($localStorage.token) {
                    config.headers.Authorization = 'Bearer ' + $localStorage.token;
                }
                return config;
            },
            'responseError': function(response) {
                if(response.status === 401 || response.status === 403) {
                    $location.path('/signin');
                }
                return $q.reject(response);
            }
        };
    }]);


}]);