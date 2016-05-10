// Import packages
var express= require('express');

// Import controllers
var auth = require('../controllers/auth');
var userController = require('../controllers/user');
var projectController = require('../controllers/project');
var blogPostController = require('../controllers/blogPost');

var router = express.Router();

// Ensure authentication to user content
router.all('/:username/*', auth.apiAuthenticated);

// Ensure user owns the content
router.all('/:username/*/:id', auth.contentOwnership);

// Endpoint handlers for /projects
router.route('/:username/projects')
	.post(projectController.postProjects)
	.get(projectController.getProjects);

// Endpoint handlers for /projects/:project_id
router.route('/:username/projects/:id')
	.get(projectController.getProject)
	.put(projectController.putProject)
	.delete(projectController.deleteProject);

// Endpoint handlers for /blogposts
router.route('/:username/blogposts')
	.post(blogPostController.postBlogPosts)
	.get(blogPostController.getBlogPosts)

// Endpoint handlers for /blogposts/:blogpost_id
router.route('/:username/blogposts/:id')
	.get(blogPostController.getBlogPost)
	.put(blogPostController.putBlogPost)
	.delete(blogPostController.deleteBlogPost);

module.exports = router;
