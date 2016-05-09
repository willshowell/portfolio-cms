// Import packages
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var exphbs = require('express-handlebars');
var Session = require('express-session');
var login = require('connect-ensure-login');

// Import controllers
var auth = require('./controllers/auth');
var userController = require('./controllers/user');
var projectController = require('./controllers/project');
var blogPostController = require('./controllers/blogPost');

// Import models
var User = require('./models/user');

// Create express application
var app = express();

// Configure view engine to render with handlebars
var hbs = exphbs.create({
	defaultLayout: 'main',
	partialsDir: [
		'views/partials/'
	]
});
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Connect to the CMS MongoDB
// (switch to an alternate DB when testing)
console.log(app.settings.env);
var mongoURI = 'mongodb://localhost:27017/cms';
if (process.env.NODE_ENV === 'test') {
	mongoURI = 'mongodb://localhost:27017/cms-testing';
}
mongoose.connect(mongoURI);


// Uncomment this line when favicon is in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(Session({ 
	secret: 'racketeering',
	resave: false,
	saveUninitialized: false 
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Define routers for express
var apiRouter = express.Router();
var appRouter = express.Router();

/* 
 * API Routes
*/
// Ensure authentication to user content
apiRouter.all('/:username/*', auth.apiAuthenticated);

// Ensure user owns the content
apiRouter.all('/:username/*/:id', auth.contentOwnership);

// Endpoint handlers for /projects
apiRouter.route('/:username/projects')
	.post(projectController.postProjects)
	.get(projectController.getProjects);
// Endpoint handlers for /projects/:project_id
apiRouter.route('/:username/projects/:id')
	.get(projectController.getProject)
	.put(projectController.putProject)
	.delete(projectController.deleteProject);

// Endpoint handlers for /blogposts
apiRouter.route('/:username/blogposts')
	.post(blogPostController.postBlogPosts)
	.get(blogPostController.getBlogPosts)
// Endpoint handlers for /blogposts/:blogpost_id
apiRouter.route('/:username/blogposts/:id')
	.get(blogPostController.getBlogPost)
	.put(blogPostController.putBlogPost)
	.delete(blogPostController.deleteBlogPost);

/* 
 * App Routes 
*/
// Endpoint handlers for /login
appRouter.route('/login')
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
appRouter.get('/logout',
	function(req, res) {
		req.logout();
		res.redirect('/');
	}
);

// Endpoint handler for /signup
appRouter.route('/signup')
	.post(userController.newUser)
	.get(function(req, res) {
		res.render('signup', {
			hideNav: true
		});
	});

// User homepage
appRouter.get('/',
	login.ensureLoggedIn('/login'),
	function(req, res) {
		res.render('user', {
			user: req.user
		});
	});

// Endpoint handler for /settings
appRouter.get('/settings',
	login.ensureLoggedIn('/login'),
	function(req, res) {
		res.render('settings', {
			username: req.user._id
		});
	});

// Endpoint handler for /projects
appRouter.get('/projects',
	login.ensureLoggedIn('/login'),
	function(req, res) {
		res.render('projects', {
			user: req.user
		});
	});

// Endpoint handlers for /projects/new
appRouter.route('/projects/new')
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
appRouter.get('/projects/:id',
	login.ensureLoggedIn('/login'),
 	function(req, res) {
		res.send('Project: ' + req.params.id);
	}); // TODO add edit capabilities




// Endpoint handler for /blogposts
appRouter.get('/blogposts',
	login.ensureLoggedIn('/login'),
	function(req, res) {
		res.render('blogposts', {
			user: req.user
		});
	});

// Endpoint handlers for /blogposts/new
appRouter.route('/blogposts/new')
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
appRouter.get('/blogposts/:id',
	login.ensureLoggedIn('/login'),
 	function(req, res) {
		res.send('Blog Post: ' + req.params.id);
	}); // TODO add edit capabilities






// Register the routes and assets directory
app.use('/api/v1', apiRouter);
app.use('/', appRouter);
app.use(express.static('public'));

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
