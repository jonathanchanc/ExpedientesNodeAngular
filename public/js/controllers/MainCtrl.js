angular.module('MainCtrl', [])

.factory('_',['$window', function($window){
            return $window._;
        }])

.controller('MainController', ['$rootScope', '$scope', '$location', '$localStorage', 'Main', 'Roles', 'Privilegios', 'Users', function($rootScope, $scope, $location, $localStorage, Main, Roles, Privilegios, Users) {
	$scope.tagline = 'Sistema para administración de ingresos y egresos';
    $rootScope._ = _;
	$scope.token = $localStorage.token;
    //$localStorage.privilegios = [];

    $scope.messageShow = false;
    $scope.messageClass = "";
    $scope.messageText = '';
    $scope.messageAlertSuccess = 'alert-success';
    $scope.messageAlertInfo = 'alert-info';
    $scope.messageAlertDanger = 'alert-danger';
    $scope.formData = {};


    $scope.getExpanded = function(){
        //Al inicial el controlador obtenemos el boton (togle data)
        $scope.buttonExpanded = angular.element( document.querySelector( '#btnExpanded' ) );
        //Obtenemos sus atributos
        $scope.classExpanded = $scope.buttonExpanded.attr('class');
        //Si contiene el atributo collapsed, significa que esta contraido, no esta desplegado y actualizamos variable
        if( _.contains($scope.classExpanded.split(' '),'collapsed') )
            $scope.hideAfterClick = false
        else
            $scope.hideAfterClick = true
    };

    
    $scope.getPrivilegios = function(){
        if($scope.token){
            Main.getPrivilegios().then(function(data){
                $scope.privilegios = $rootScope.privilegios;
                $scope.modulos = $rootScope.modulos;
                $scope.usuario = $rootScope.usuario;
                //console.log($scope.privilegios);
                //console.log($scope.modulos);
            });
        }
        //Leemos el estado del nav al iniciar la vista y despues de obtener los privilegios
        $scope.getExpanded();
            
        /*
            Main.getPrivilegios()
                .success(function(data) {
                    console.log(data);
                            //Copiamos el objeto data a ambos arrays - Data es una instancia del modelo Users
                            var privilegios = angular.copy(data);
                            var modulos = angular.copy(data);
                            //Extraemos todos los datos a partir de una propiedad de Users
                            privilegios = _.pluck(privilegios, 'nombre');
                            modulos = _.pluck(modulos, 'modulo');
                            //Asiganmos al $scope el array sin valores repetidos (unique)
                            $scope.privilegios = _.uniq(privilegios);
                            $scope.modulos = _.uniq(modulos);
                            console.log($scope.privilegios);
                            $localStorage.privilegios = $scope.privilegios;
                })
                .error(function(data, status) {
                    console.log('Error: ' + status);
                    console.log(data);
                })
            ;
            */

        /*
        if($scope.token)
        Main.me(function(res) {
            Roles.findById(res.data.rol)
                .success(function(data) {
                    $scope.rol = angular.copy(data);

                    Privilegios.query({ query: { _id: {$in: data.privilegios}, estado: 'Activo' } })
                        .success(function(data) {
                            //Copiamos el objeto data a ambos arrays - Data es una instancia del modelo Users
                            var privilegios = angular.copy(data.instanceList);
                            var modulos = angular.copy(data.instanceList);
                            //Extraemos todos los datos a partir de una propiedad de Users
                            privilegios = _.pluck(privilegios, 'nombre');
                            modulos = _.pluck(modulos, 'modulo');
                            //Asiganmos al $scope el array sin valores repetidos (unique)
                            $scope.privilegios = _.uniq(privilegios);
                            $scope.modulos = _.uniq(modulos);
                            console.log($scope.privilegios);
                            $localStorage.privilegios = $scope.privilegios
                        });

                });


        }, function() {
            $rootScope.error = 'Failed to fetch details';
        });
        */
                
    }
    
	$scope.signin = function() {
        var formData = {
            usuario: $scope.usuario,
            password: $scope.password
        }

        Main.signin(formData, function(res) {
            if (res.type == false) {
                alert(res.data)    
            } else {
                $localStorage.token = res.data.token;
                window.location = "/";
            }
        }, function() {
            $rootScope.error = 'Failed to signin';
        })
    };

    // $scope.signup = function() {
    //     var formData = {
    //         usuario: $scope.usuario,
    //         password: $scope.password
    //     }

    //     Main.save(formData, function(res) {
    //         if (res.type == false) {
    //             alert(res.data)
    //         } else {
    //             $localStorage.token = res.data.token;
    //             window.location = "/"    
    //         }
    //     }, function() {
    //         $rootScope.error = 'Failed to signup';
    //     })
    // };

    /*
    $scope.me = function() {
        console.log($rootScope.privilegios);
        Main.me(
            //).success(
            function(res) {
            $scope.myDetails = res;
        },
        //).error(
            function() {
            $rootScope.error = 'Failed to fetch details';
            console.log('Failed to fetch details');
        });
    };
    */

    $scope.logout = function() {
        Main.logout(function() {
            window.location = "/"
        }, function() {
            alert("Failed to logout!");
        });
    };

    $scope.changePassword = function(isValid, _id) {
        $scope.formData.lockButtonSave = true;
        $scope.messageShow = false;
        $scope.messageClass = "";
        $scope.messageText = '';

        //console.log(/^[a-z0-9]*$/i.test($scope.formData.old_password));
        //console.log(/^[a-z0-9]*$/i.test($scope.formData.password));
        //console.log(/^[a-z0-9]*$/i.test($scope.formData.confirm_password));

        //Valida formData
        if (isValid) {
            //Solo acepta letras y numeros
            // /^[a-z0-9]+$/i
            // ^         start of string
            // [a-z0-9]  a or b or c or ... z or 0 or 1 or ... 9
            // *         zero or more times
            // $         end of string
            // /i        case-insensitive
            if ( ( /^[a-z0-9]*$/i.test($scope.formData.old_password) ) == true &&
                ( /^[a-z0-9]*$/i.test($scope.formData.password) ) == true &&
                ( /^[a-z0-9]*$/i.test($scope.formData.confirm_password) ) == true ){

                if($scope.formData.password == $scope.formData.confirm_password){
                    if($scope.formData.old_password == $scope.usuario.password){
                        //$scope.usuario.password = $scope.formData.password;
                        var data = { password: $scope.formData.password };
                        Users.changePassword(_id,data)
                            .success(function(data) {
                                //$scope.formData = {};
                                $localStorage.token = data.token;
                                window.location = "/me";
                                //$location.path('/me');
                                //console.log($scope.label.updateSuccess);
                                /*Main.signin({usuario: data.usuario, password: data.password }, function(res) {
                                    if (res.type == false) {
                                        //alert(res.data)
                                        console.log('Failed to signin');
                                    } else {
                                        $localStorage.token = res.data.token;
                                        window.location = "/";
                                    }
                                }, function() {
                                    $rootScope.error = 'Failed to signin';
                                })*/


                                //COMO ENVIAR ALERTA?                           
                                $scope.showMessage(true,$scope.messageAlertSuccess,'Password actuaizado');
                            })
                            .error(function(data, status) {
                                $scope.showMessage(true,$scope.messageAlertDanger,'Error al actualizar',status,data);
                            });
                    } else {
                        $scope.showMessage(true,$scope.messageAlertDanger,'La contraseña es incorrecta');    
                    }
                } else {
                    $scope.showMessage(true,$scope.messageAlertDanger,'La nueva contraseña no es igual a la confirmación');    
                }
            } else {
                $scope.showMessage(true,$scope.messageAlertDanger,'Solo se aceptan letras y números');       
            }
        } else {
            $scope.showMessage(true,$scope.messageAlertDanger,'Rellene los datos correctamente');
        }
    };

    $scope.showMessage = function(show,type,message,status,data) {
        $scope.formData.lockButtonSave = false;
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