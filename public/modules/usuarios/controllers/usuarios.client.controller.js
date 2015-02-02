'use strict';

// Usuarios controller
angular.module('usuarios').controller('UsuariosController', ['$scope', '$stateParams', '$location', 'Authentication', 'Usuarios',
	function($scope, $stateParams, $location, Authentication, Usuarios) {
		$scope.authentication = Authentication;

		// Create new Usuario
		$scope.create = function() {
			// Create new Usuario object
			var usuario = new Usuarios ({
				name: this.name
			});

			// Redirect after save
			usuario.$save(function(response) {
				$location.path('usuarios/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Usuario
		$scope.remove = function(usuario) {
			if ( usuario ) { 
				usuario.$remove();

				for (var i in $scope.usuarios) {
					if ($scope.usuarios [i] === usuario) {
						$scope.usuarios.splice(i, 1);
					}
				}
			} else {
				$scope.usuario.$remove(function() {
					$location.path('usuarios');
				});
			}
		};

		// Update existing Usuario
		$scope.update = function() {
			var usuario = $scope.usuario;

			usuario.$update(function() {
				$location.path('usuarios/' + usuario._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Usuarios
		$scope.find = function() {
			$scope.usuarios = Usuarios.query();
		};

		// Find existing Usuario
		$scope.findOne = function() {
			$scope.usuario = Usuarios.get({ 
				usuarioId: $stateParams.usuarioId
			});
		};
                
                // Find existing Usuario
		$scope.jnMi_json = {
                    strSaludo: "Hola mundo frank"
                };
	}
]);