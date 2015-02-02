'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var usuarios = require('../../app/controllers/usuarios.server.controller');

	// Usuarios Routes
	app.route('/usuarios')
		.get(usuarios.list)
		.post(users.requiresLogin, usuarios.create);

	app.route('/usuarios/:usuarioId')
		.get(usuarios.read)
		.put(users.requiresLogin, usuarios.hasAuthorization, usuarios.update)
		.delete(users.requiresLogin, usuarios.hasAuthorization, usuarios.delete);

	// Finish by binding the Usuario middleware
	app.param('usuarioId', usuarios.usuarioByID);
};
