// Import packages
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Import controllers
var projectController = require('./controllers/project');
var blogPostController = require('./controllers/blogPost');

// Connect to the CMS MongoDB
mongoose.connect('mongodb://localhost:27017/cms');

// Create express application
var app = express();

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
var interfaceRouter = express.Router();

// Endpoint handlers for /projects
apiRouter.route('/projects')
	.post(projectController.postProjects)
	.get(projectController.getProjects);

// Endpoint handlers for /projects/:project_id
apiRouter.route('/projects/:project_id')
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

// Endpoint handler for /
interfaceRouter.get('/', function(req, res) {
	res.render('index', { title: 'Portfolio CMS' });
});

// Register all the routes (api routes start with /api/v1/)
app.use('/api/v1', apiRouter);
app.use('/', interfaceRouter);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// Error handlers

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
