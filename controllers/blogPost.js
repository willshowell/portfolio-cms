// Import packages
var deleteKey = require('key-del');

// Import models
var BlogPost = require('../models/blogPost');


// Endpoint for POST /api/blogposts/
exports.postBlogPosts = function(req, res) {
	// Create a new instance of a blog post
	var post = new BlogPost();
	
	// Set the blog post parameters that came with the POST
	post.title = req.body.title;
	post.text = req.body.text;
	
	// Save the blog post, checking for errors
	post.save(function(err) {
		if (err) {
			res.send(err);
		}	
		res.json({
			message: "Blog post created",
			data: post
		})
	});
};

// Endpoint for GET /api/blogposts
exports.getBlogPosts = function(req, res) {
	// Find all the blog posts
	BlogPost.find(function(err, posts) {
		if (err) {
			res.send(err);
		}

		var filteredPosts = [];

		posts.forEach(function(post, index) {
			var filteredPost = {
				_id: post._id,
				title: post.title,
				short_text: post.text.substring(0, 300)
			};
			filteredPosts.push(filteredPost);
		});
		
		res.json(filteredPosts);
	});
};

// Endpoint for GET /api/blogposts/:blogpost_id
exports.getBlogPost = function(req, res) {
	// Find the specified blog post
	BlogPost.findById(req.params.blogpost_id, function(err, post) {
		if (err) {
			res.send(err);
		}
		res.json(post);
	});
};

// Endpoint for PUT /api/blogposts/:blogpost_id
exports.putBlogPost = function(req, res) {
	// Find the specified blog post
	BlogPost.findById(req.params.blogpost_id, function(err, post) {
		if(err) {
			res.send(err);
		}
		
		// Update the values
		post.title = req.body.title || post.title;
		post.text = req.body.text || post.text;
		
		// Save the blog post
		post.save(function(err) {
			if (err) {
				res.send(err);
			}
			res.json({
				message: "Blog post updated",
				data: post
			})
		});
			
	});
};

// Endpoint for DELETE /api/blogposts/:blogpost_id
exports.deleteBlogPost = function(req, res) {
	// Find the specified blog post and remote it
	BlogPost.findByIdAndRemove(req.params.blogpost_id, function(err) {
		if(err) {
			res.send(err);
		}
		res.json({
			message: "Blog post deleted"
		});
	});
};