// Import packages
var mongoose = require('mongoose');

// Define project schema
var ProjectSchema = new mongoose.Schema({
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