// Import packages
var mongoose = require('mongoose');

// Define project schema
var BlogPostSchema = new mongoose.Schema({
	_user: { 
		type: String,
		ref: 'User'
	 },
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
module.exports = mongoose.model('BlogPost', BlogPostSchema);
