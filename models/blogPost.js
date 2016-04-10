// Import packages
var mongoose = require('mongoose');

// Define project schema
var BlogSchema = new mongoose.Schema({
	title: String,
	text: String
},
{
	timestamps: {
		createdAt: 'created_at',
		updatedAt: 'updated_at'
	}
});

// Export the model
module.exports = mongoose.model('Blog', BlogSchema);