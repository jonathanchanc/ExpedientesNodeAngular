angular.module('FacturaService', [])

	// super simple service
	// each function returns a promise object 
	.factory('Facturas', ['$rootScope', '$http',function($rootScope, $http) {
        var baseUrl = $rootScope.baseUrl;
        var nameUrl = '/api/facturas'

		return {
			query : function(data) {
				return $http.post(baseUrl + nameUrl + '/query/', data);
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
			updateFichasProgramas : function(data) {
				return $http.post(baseUrl + nameUrl + '/updateficha', data);
			},
			updateEgresoByFactura : function(data) {
				return $http.post(baseUrl + nameUrl + '/updateegreso', data);
			},
			delete : function(id) {
				return $http.delete(baseUrl + nameUrl + '/' + id);
			}
		}
	}]);