'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Usuario Schema
 */
var UsuarioSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Debe ingresar el nombre del usuario',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Usuario', UsuarioSchema);