'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Usuario = mongoose.model('Usuario'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, usuario;

/**
 * Usuario routes tests
 */
describe('Usuario CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Usuario
		user.save(function() {
			usuario = {
				name: 'Usuario Name'
			};

			done();
		});
	});

	it('should be able to save Usuario instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Usuario
				agent.post('/usuarios')
					.send(usuario)
					.expect(200)
					.end(function(usuarioSaveErr, usuarioSaveRes) {
						// Handle Usuario save error
						if (usuarioSaveErr) done(usuarioSaveErr);

						// Get a list of Usuarios
						agent.get('/usuarios')
							.end(function(usuariosGetErr, usuariosGetRes) {
								// Handle Usuario save error
								if (usuariosGetErr) done(usuariosGetErr);

								// Get Usuarios list
								var usuarios = usuariosGetRes.body;

								// Set assertions
								(usuarios[0].user._id).should.equal(userId);
								(usuarios[0].name).should.match('Usuario Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Usuario instance if not logged in', function(done) {
		agent.post('/usuarios')
			.send(usuario)
			.expect(401)
			.end(function(usuarioSaveErr, usuarioSaveRes) {
				// Call the assertion callback
				done(usuarioSaveErr);
			});
	});

	it('should not be able to save Usuario instance if no name is provided', function(done) {
		// Invalidate name field
		usuario.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Usuario
				agent.post('/usuarios')
					.send(usuario)
					.expect(400)
					.end(function(usuarioSaveErr, usuarioSaveRes) {
						// Set message assertion
						(usuarioSaveRes.body.message).should.match('Please fill Usuario name');
						
						// Handle Usuario save error
						done(usuarioSaveErr);
					});
			});
	});

	it('should be able to update Usuario instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Usuario
				agent.post('/usuarios')
					.send(usuario)
					.expect(200)
					.end(function(usuarioSaveErr, usuarioSaveRes) {
						// Handle Usuario save error
						if (usuarioSaveErr) done(usuarioSaveErr);

						// Update Usuario name
						usuario.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Usuario
						agent.put('/usuarios/' + usuarioSaveRes.body._id)
							.send(usuario)
							.expect(200)
							.end(function(usuarioUpdateErr, usuarioUpdateRes) {
								// Handle Usuario update error
								if (usuarioUpdateErr) done(usuarioUpdateErr);

								// Set assertions
								(usuarioUpdateRes.body._id).should.equal(usuarioSaveRes.body._id);
								(usuarioUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Usuarios if not signed in', function(done) {
		// Create new Usuario model instance
		var usuarioObj = new Usuario(usuario);

		// Save the Usuario
		usuarioObj.save(function() {
			// Request Usuarios
			request(app).get('/usuarios')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Usuario if not signed in', function(done) {
		// Create new Usuario model instance
		var usuarioObj = new Usuario(usuario);

		// Save the Usuario
		usuarioObj.save(function() {
			request(app).get('/usuarios/' + usuarioObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', usuario.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Usuario instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Usuario
				agent.post('/usuarios')
					.send(usuario)
					.expect(200)
					.end(function(usuarioSaveErr, usuarioSaveRes) {
						// Handle Usuario save error
						if (usuarioSaveErr) done(usuarioSaveErr);

						// Delete existing Usuario
						agent.delete('/usuarios/' + usuarioSaveRes.body._id)
							.send(usuario)
							.expect(200)
							.end(function(usuarioDeleteErr, usuarioDeleteRes) {
								// Handle Usuario error error
								if (usuarioDeleteErr) done(usuarioDeleteErr);

								// Set assertions
								(usuarioDeleteRes.body._id).should.equal(usuarioSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Usuario instance if not signed in', function(done) {
		// Set Usuario user 
		usuario.user = user;

		// Create new Usuario model instance
		var usuarioObj = new Usuario(usuario);

		// Save the Usuario
		usuarioObj.save(function() {
			// Try deleting Usuario
			request(app).delete('/usuarios/' + usuarioObj._id)
			.expect(401)
			.end(function(usuarioDeleteErr, usuarioDeleteRes) {
				// Set message assertion
				(usuarioDeleteRes.body.message).should.match('User is not logged in');

				// Handle Usuario error error
				done(usuarioDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Usuario.remove().exec();
		done();
	});
});