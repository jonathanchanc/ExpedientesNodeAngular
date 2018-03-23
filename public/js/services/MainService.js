angular.module('MainService', [])

	// super simple service
	// each function returns a promise object 
	.factory('Main', ['$rootScope', '$http', '$localStorage', function($rootScope, $http, $localStorage){
        //$rootScope.baseUrl = "http://ades-suciqroo.rhcloud.com";
        //$rootScope.baseUrl = "http://easingie-suciqroo.rhcloud.com";
        //$rootScope.baseUrl = "http://192.168.1.132:3000";
        //$rootScope.baseUrl = "http://10.10.35.44:3000";
        $rootScope.baseUrl = "http://localhost:3000";
        var nameUrl = '/api/main'
        var baseUrl = $rootScope.baseUrl;

        function changeUser(user) {
            angular.extend(currentUser, user);
        }

        function urlBase64Decode(str) {
            var output = str.replace('-', '+').replace('_', '/');
            switch (output.length % 4) {
                case 0:
                    break;
                case 2:
                    output += '==';
                    break;
                case 3:
                    output += '=';
                    break;
                default:
                    throw 'Illegal base64url string!';
            }
            return window.atob(output);
        }

        function getUserFromToken() {
            var token = $localStorage.token;
            var user = {};
            if (typeof token !== 'undefined') {
                var encoded = token.split('.')[1];
                user = JSON.parse(urlBase64Decode(encoded));
            }
            return user;
        }

        var currentUser = getUserFromToken();

        return {
            // save: function(data, success, error) {
            //     $http.post(baseUrl + '/api/signin', data).success(success).error(error)
            // },
            signin: function(data, success, error) {
                $http.post(baseUrl + nameUrl + '/authenticate', data).success(success).error(error)
            },
            me: function(success, error) {
                $http.get(baseUrl + nameUrl + '/me').success(success).error(error)
            },
            logout: function(success) {
                changeUser({});
                delete $localStorage.token;
                //delete $localStorage.privilegios;
                success();
            },
            getPrivilegios: function() { //Asigna los privilegios al rootScope cada vez que es llamada
                return $http.post(baseUrl + nameUrl + '/privilegios')
                    .then(function(data) {
                        //Copiamos el objeto data a ambos arrays - Data es una instancia del modelo Users
                        //console.log(data);
                        var privilegios = angular.copy(data.data.privilegios);
                        var modulos = angular.copy(data.data.privilegios);
                        //Extraemos todos los datos a partir de una propiedad de Users
                        privilegios = _.pluck(privilegios, 'nombre');
                        modulos = _.pluck(modulos, 'modulo');
                        //Asiganmos al $scope el array sin valores repetidos (unique)
                        delete data.data.usuario.token;
                        $rootScope.usuario = data.data.usuario;
                        $rootScope.privilegios = _.uniq(privilegios);
                        $rootScope.modulos = _.uniq(modulos);
                    })
                    .catch(function(response) {
                        console.log('Error: P1RS');
                        console.log(response);
                        //console.log('Error: ' + response.status);
                        //console.log(response.data);
                        //return undefined;
                    });
                }
        };
    }

]);