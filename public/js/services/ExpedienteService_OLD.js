angular.module('ExpedienteService', [])

	// super simple service
	// each function returns a promise object 
	.factory('Expedientes', ['$rootScope', '$http',function($rootScope, $http) {
        var baseUrl = $rootScope.baseUrl;
        var nameUrl = '/api/expedientes'

		return {
			get : function() {
				return $http.get(baseUrl + nameUrl);
			},
			findById : function(id) {
				return $http.get(baseUrl + nameUrl + '/' + id);
			},
			create : function(data) {
				return $http.post(baseUrl + nameUrl, data);
			},
			update : function(id,data) {
				return $http.put(baseUrl + nameUrl + '/' + id, data);
			},
			delete : function(id) {
				return $http.delete(baseUrl + nameUrl + '/' + id);
			},
			search : function(data) {
				return $http.post(baseUrl + nameUrl + 'Search/', data);
			}
		}
	}]);