// Import packages
var mongoose = require('mongoose');

// Define project schema
var ProjectSchema = new mongoose.Schema({
	name: String,
	tagline: String,
	hero_url: String
});

// Export the model
module.exports = mongoose.model('Project', ProjectSchema);