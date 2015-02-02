'use strict';

(function() {
	// Usuarios Controller Spec
	describe('Usuarios Controller Tests', function() {
		// Initialize global variables
		var UsuariosController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Usuarios controller.
			UsuariosController = $controller('UsuariosController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Usuario object fetched from XHR', inject(function(Usuarios) {
			// Create sample Usuario using the Usuarios service
			var sampleUsuario = new Usuarios({
				name: 'New Usuario'
			});

			// Create a sample Usuarios array that includes the new Usuario
			var sampleUsuarios = [sampleUsuario];

			// Set GET response
			$httpBackend.expectGET('usuarios').respond(sampleUsuarios);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.usuarios).toEqualData(sampleUsuarios);
		}));

		it('$scope.findOne() should create an array with one Usuario object fetched from XHR using a usuarioId URL parameter', inject(function(Usuarios) {
			// Define a sample Usuario object
			var sampleUsuario = new Usuarios({
				name: 'New Usuario'
			});

			// Set the URL parameter
			$stateParams.usuarioId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/usuarios\/([0-9a-fA-F]{24})$/).respond(sampleUsuario);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.usuario).toEqualData(sampleUsuario);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Usuarios) {
			// Create a sample Usuario object
			var sampleUsuarioPostData = new Usuarios({
				name: 'New Usuario'
			});

			// Create a sample Usuario response
			var sampleUsuarioResponse = new Usuarios({
				_id: '525cf20451979dea2c000001',
				name: 'New Usuario'
			});

			// Fixture mock form input values
			scope.name = 'New Usuario';

			// Set POST response
			$httpBackend.expectPOST('usuarios', sampleUsuarioPostData).respond(sampleUsuarioResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Usuario was created
			expect($location.path()).toBe('/usuarios/' + sampleUsuarioResponse._id);
		}));

		it('$scope.update() should update a valid Usuario', inject(function(Usuarios) {
			// Define a sample Usuario put data
			var sampleUsuarioPutData = new Usuarios({
				_id: '525cf20451979dea2c000001',
				name: 'New Usuario'
			});

			// Mock Usuario in scope
			scope.usuario = sampleUsuarioPutData;

			// Set PUT response
			$httpBackend.expectPUT(/usuarios\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/usuarios/' + sampleUsuarioPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid usuarioId and remove the Usuario from the scope', inject(function(Usuarios) {
			// Create new Usuario object
			var sampleUsuario = new Usuarios({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Usuarios array and include the Usuario
			scope.usuarios = [sampleUsuario];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/usuarios\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleUsuario);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.usuarios.length).toBe(0);
		}));
	});
}());