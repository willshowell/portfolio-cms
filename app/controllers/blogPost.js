// Import packages
var deleteKey = require('key-del');

// Import models
var BlogPost = require('../models/blogPost');
var User = require('../models/user');

// Endpoint for POST /api/v1/:username/blogposts/
exports.postBlogPosts = function(req, res) {
	
	// Get the user
	User.findById(req.params.username, function(err, user) {
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

			// Push the blog post to the user
			user.blogposts.push(post);
			user.save(function(err) {
				if (err) {
					res.send(err);
				}
				res.json({
					message: "Blog post created",
					data: post
				});
			});
		});
	});
};

// Endpoint for GET /api/v1/:username/blogposts
exports.getBlogPosts = function(req, res) {

	// Get the user
	User.findById(req.params.username, function(err, user) {
		if(err) {
			res.send(err);
		}

		// Get  alist of all the user's blogposts
		var postList = user.blogposts;
	
		var filteredPosts = [];
		var postsLeft = postList.length;

		// Respond if there are no blogposts
		if (postsLeft == 0) {
			finish();
		}

		// Find all the blog posts for this user
		postList.forEach(function(blogpost, index) {
			BlogPost.findById(blogpost, function(err, post) {
				if (err) {
					res.send(err);
				}
				var filteredPost = {
					_id: post._id,
					title: post.title,
					short_text: post.text.substring(0, 300)
				};
				filteredPosts.push(filteredPost);
				finish();
			});
		});
		// TODO this is a lame way to do this. Should be a promise :'(
		function finish() {
			postsLeft -= 1;
			if(postsLeft < 1) {
				res.json(filteredPosts);
			}
		};		
	});
};

// Endpoint for GET /api/v1/:username/blogposts/:blogpost_id
exports.getBlogPost = function(req, res) {
	
	// Get the user
	User.findById(req.params.username, function(err, user) {
		if(err) {
			res.send(err);
		}

		// Find the specified blog post
		BlogPost.findById(req.params.blogpost_id, function(err, post) {
			if (err) {
				res.send(err);
			}
			res.json(post);
		});
	});
};

// Endpoint for PUT /api/v1/:username/blogposts/:blogpost_id
exports.putBlogPost = function(req, res) {

	// Get the user
	User.findById(req.params.username, function(err, user) {

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
				});
			});
		});
	});				
};

// Endpoint for DELETE /api/blogposts/:blogpost_id
exports.deleteBlogPost = function(req, res) {
	
	// Get the user
	User.findById(req.params.username, function(err, user) {
	
		// Find the specified blog post and remote it
		BlogPost.findByIdAndRemove(req.params.blogpost_id, function(err) {
			if(err) {
				res.send(err);
			} else {
				var blogpostIndex = user.blogposts.indexOf(req.params.blogpost_id);
				user.blogposts.splice(blogpostIndex, 1);
				user.save(function(err) {
					if(err) {
						res.send(err);
					}
					res.json({
						message: "Blog post deleted"
					});
				});
			}
		});
	});
};
