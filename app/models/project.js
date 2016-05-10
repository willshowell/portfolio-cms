// Import packages
var mongoose = require('mongoose');

// Import other models
var User = require('./user');

// Define project schema
var ProjectSchema = new mongoose.Schema({
	_user: {
		type: String,
		ref: 'User'
	},
	name: String,
	tagline: String,
	hero_url: String,
	description: String,
	source_url: String,
	project_url: String,
	images: [String]	
},
{
	timestamps: {
		createdAt: 'created_at',
		updatedAt: 'updated_at'
	}
});

// Export the model
module.exports = mongoose.model('Project', ProjectSchema);
