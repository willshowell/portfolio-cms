// Import packages
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');

// Import controllers
var userController = require('./controllers/user');
var projectController = require('./controllers/project');
var blogPostController = require('./controllers/blogPost');

// Create express application
var app = express();

// Initialize passport
app.use(passport.initialize());

// Connect to the CMS MongoDB
// (switch to an alternate DB when testing)
console.log(app.settings.env);
var mongoURI = 'mongodb://localhost:27017/cms';
if (process.env.NODE_ENV === 'test') {
	mongoURI = 'mongodb://localhost:27017/cms-testing';
}
mongoose.connect(mongoURI);

// Setup view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Uncomment this line when favicon is in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Create routers for express
var apiRouter = express.Router();
var applicationRouter = express.Router();

/* 
 * API Routes
*/
// Endpoint handlers for /projects
apiRouter.route('/:username/projects')
	.post(projectController.postProjects)
	.get(projectController.getProjects);

// Endpoint handlers for /projects/:project_id
apiRouter.route('/:username/projects/:project_id')
	.get(projectController.getProject)
	.put(projectController.putProject)
	.delete(projectController.deleteProject);

// Endpoint handlers for /blogposts
apiRouter.route('/blogposts')
	.post(blogPostController.postBlogPosts)
	.get(blogPostController.getBlogPosts)

// Endpoint handlers for /blogposts/:blogpost_id
apiRouter.route('/blogposts/:blogpost_id')
	.get(blogPostController.getBlogPost)
	.put(blogPostController.putBlogPost)
	.delete(blogPostController.deleteBlogPost);

/* 
 * Application Routes 
*/
// Endpoint handler for /
applicationRouter.get('/', function(req, res) {
	// TODO redirect to /:username or /:login depending on session
	res.render('index', { title: 'Portfolio CMS' });
});

// Endpoint handler for /login
applicationRouter.get('/login', function(req, res) {
	res.send('This is where you will log in');
});

// Endpoint handler for /signup
applicationRouter.get('/signup', function(req, res) {
	res.send('This is where you will sign up');
});

// Endpoint handler for /:username
applicationRouter.get('/:username', function(req, res) {
	res.send('Your username is ' + req.params.username);
});

// Endpoint handler for /:username/settings
applicationRouter.get('/:username/settings', function(req, res) {
	res.send('Here are ' + req.params.username + '\'s settings');
});

// Endpoint handler for /:username/projects
applicationRouter.get('/:username/projects', function(req, res) {
	res.send('Your username is ' + req.params.username + ' and here are your projects');
});

// Endpoint handler for /:username/projects/new
applicationRouter.get('/:username/projects/new', function(req, res) {
	res.send('Making a new project');
});

applicationRouter.get('/:username/projects/:id', function(req, res) {
	res.send('Project: ' + req.params.id);
});

// Register all the routes (api routes start with /api/v1/)
app.use('/api/v1', apiRouter);
app.use('/', applicationRouter);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

/*
 * Error handlers
*/
// Dev error handler
// Print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// Production error handler
// Don't show stacktrace
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});

module.exports = app;
