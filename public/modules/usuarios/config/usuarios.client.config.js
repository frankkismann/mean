'use strict';

// Configuring the Articles module
angular.module('usuarios').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Usuarios', 'usuarios', 'dropdown', '/usuarios(/create)?');
		Menus.addSubMenuItem('topbar', 'usuarios', 'List Usuarios', 'usuarios');
		Menus.addSubMenuItem('topbar', 'usuarios', 'New Usuario', 'usuarios/create');
	}
]);