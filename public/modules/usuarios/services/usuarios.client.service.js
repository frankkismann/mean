'use strict';

//Usuarios service used to communicate Usuarios REST endpoints
angular.module('usuarios').factory('Usuarios', ['$resource',
	function($resource) {
		return $resource('usuarios/:usuarioId', { usuarioId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);