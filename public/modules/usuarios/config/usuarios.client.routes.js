'use strict';

//Setting up route
angular.module('usuarios').config(['$stateProvider',
	function($stateProvider) {
		// Usuarios state routing
		$stateProvider.
		state('listUsuarios', {
			url: '/usuarios',
			templateUrl: 'modules/usuarios/views/list-usuarios.client.view.html'
		}).
		state('createUsuario', {
			url: '/usuarios/create',
			templateUrl: 'modules/usuarios/views/create-usuario.client.view.html'
		}).
		state('viewUsuario', {
			url: '/usuarios/:usuarioId',
			templateUrl: 'modules/usuarios/views/view-usuario.client.view.html'
		}).
		state('editUsuario', {
			url: '/usuarios/:usuarioId/edit',
			templateUrl: 'modules/usuarios/views/edit-usuario.client.view.html'
		});
	}
]);