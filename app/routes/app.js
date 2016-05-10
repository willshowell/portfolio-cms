// Import packages
var express= require('express');
var login = require('connect-ensure-login');

// Import controllers
var auth = require('../controllers/auth');
var userController = require('../controllers/user');
var projectController = require('../controllers/project');
var blogPostController = require('../controllers/blogPost');

var router = express.Router();

// Endpoint handlers for /login
router.route('/login')
	.post(
		auth.appAuthenticated,
		function(req, res) {
			console.log(req.user._id);
			res.redirect('/');
		}
	)
	.get(function(req, res) {
		res.render('login', {
			hideNav: true
		});
	});

// Endpoint handlers for /logout
router.get('/logout',
	function(req, res) {
		req.logout();
		res.redirect('/');
	}
);

// Endpoint handler for /signup
router.route('/signup')
	.post(userController.newUser)
	.get(function(req, res) {
		res.render('signup', {
			hideNav: true
		});
	});

// User homepage
router.get('/',
	login.ensureLoggedIn('/login'),
	function(req, res) {
		res.render('user', {
			user: req.user
		});
	});

// Endpoint handler for /settings
router.get('/settings',
	login.ensureLoggedIn('/login'),
	function(req, res) {
		res.render('settings', {
			user: req.user
		});
	});

// Endpoint handler for /projects
router.get('/projects',
	login.ensureLoggedIn('/login'),
	function(req, res) {
		res.render('projects', {
			user: req.user
		});
	});

// Endpoint handlers for /projects/new
router.route('/projects/new')
	.get(
		login.ensureLoggedIn('/login'),
		function(req, res) {
			res.send('Making a new project');
		})
	.post(
		login.ensureLoggedIn('/login'),
		function(req, res) {
			res.redirect('/projects/new'); //TODO generate new project
		});

// Endpoint handler for a specific project
router.get('/projects/:id',
	login.ensureLoggedIn('/login'),
 	function(req, res) {
		res.send('Project: ' + req.params.id);
	}); // TODO add edit capabilities

// Endpoint handler for /blogposts
router.get('/blogposts',
	login.ensureLoggedIn('/login'),
	function(req, res) {
		res.render('blogposts', {
			user: req.user
		});
	});

// Endpoint handlers for /blogposts/new
router.route('/blogposts/new')
	.get(
		login.ensureLoggedIn('/login'),
		function(req, res) {
			res.send('Making a new blogpost');
		})
	.post(
		login.ensureLoggedIn('/login'),
		function(req, res) {
			res.redirect('/blogposts/new'); //TODO generate new blogpost
		});

// Endpoint handler for a specific project
router.get('/blogposts/:id',
	login.ensureLoggedIn('/login'),
 	function(req, res) {
		res.send('Blog Post: ' + req.params.id);
	}); // TODO add edit capabilities


module.exports = router;
