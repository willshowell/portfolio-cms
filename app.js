// Import packages
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var exphbs = require('express-handlebars');
var Session = require('express-session');
var login = require('connect-ensure-login');

// Import controllers
var userController = require('./controllers/user');
var projectController = require('./controllers/project');
var blogPostController = require('./controllers/blogPost');

// Import models
var User = require('./models/user');


// Configure local strategy for use by passport
passport.use(new LocalStrategy(
	function(username, password, done) {
		User.findById(username, function(err, user) {
			if (err) { return done(err); }
			if (!user) {
				console.log('no user found :(');
				return done(null, false, { message: 'Incorrect' });
			}
			user.verifyPassword(password, function(err, isMatch) {
				if (err) { return done(err); }
				if (!isMatch) {
					console.log('wrong password bro');
					return done(null, false, { message: 'Incorrect' });
				}
				return done(null, user);
			});
		});
	}
));	

// TODO serialize and deserialize
passport.serializeUser(function(user, cb) {
	cb(null, user._id);
});

passport.deserializeUser(function(id, cb) {
	User.findById(id, function(err, user) {
		if (err) { return cb(err); }
		cb(null, user);
	});
});

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
var applicationRouter = express.Router();

/* 
 * API Routes
*/
// Custom middleware substack for authenticating users
apiRouter.use('/:username', function(req, res, next) {

	// Check that the user provided the correct secret
	var providedSecret;
	if (req.method == 'GET') {
		providedSecret = req.query.secret;
	} else {
		providedSecret = req.body.secret;
	}

	if (!providedSecret) {
		res.json({
			message: "Secret not provided. Unable to authenticate."
		});
	} else {
		User.findById(req.params.username, function(err, user) {
			if(err) {
				next(err);
			}
			if(user) {
				user.verifySecret(providedSecret, function(isMatch) {
					if (!isMatch) {
						console.log("Should be " + user.secret);
						res.json({
							message: "Wrong secret provided. Unable to authenticate"
						});
					} else {
				 	next();	
					}
				});
			} else {
				res.json({
					message: "User does not exist."
				});
			}
		});
	}
});
// Middleware substack for verifying user access to project
apiRouter.use('/:username/projects/:project_id', function(req, res, next) {
	console.log(req.params.username+" is asking for "+req.params.project_id);
	User.findById(req.params.username, function(err, user) {
		if(err) {
			next(err);
		}
		var projectIndex = user.projects.indexOf(req.params.project_id);
		console.log(projectIndex);
		if (projectIndex == -1) {
			res.json({
				message: "Project does not belong to you"
			});
		} else {
			next();
		}
	});
});
// Middleware substack for verifying user access to blogpost
apiRouter.use('/:username/blogposts/:blogpost_id', function(req, res, next) {
	User.findById(req.params.username, function(err, user) {
		if(err) {
			next(err);
		}
		var blogpostIndex = user.blogposts.indexOf(req.params.blogpost_id);
		if (blogpostIndex == -1) {
			res.json({
				message: "Blogpost does not belong to you"
			});
		} else {
			next();
		}
	});
});
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
apiRouter.route('/:username/blogposts')
	.post(blogPostController.postBlogPosts)
	.get(blogPostController.getBlogPosts)

// Endpoint handlers for /blogposts/:blogpost_id
apiRouter.route('/:username/blogposts/:blogpost_id')
	.get(blogPostController.getBlogPost)
	.put(blogPostController.putBlogPost)
	.delete(blogPostController.deleteBlogPost);

/* 
 * Application Routes 
*/
// TODO user middleware for authenticated session of logged in users
// Endpoint handler for /

// Endpoint handlers for /login
applicationRouter.post('/login',
	passport.authenticate('local', {
		successReturnToOrRedirect: '/',
		failureRedirect: '/login'
	}),
	function(req, res) {
		console.log(req.user._id);
		res.redirect('/');
	}
);
applicationRouter.get('/login',
	function(req, res) {
		res.render('login', {
			hideNav: true
		});
	}
);

// Endpoint handlers for /logout
applicationRouter.get('/logout',
	function(req, res) {
		req.logout();
		res.redirect('/');
	}
);

// Endpoint handler for /signup
applicationRouter.route('/signup')
	.post(userController.newUser)
	.get(function(req, res) {
		res.render('signup', {
			hideNav: true
		});
	});

// User homepage
applicationRouter.get('/',
	login.ensureLoggedIn('/login'),
	function(req, res) {
		res.render('user', {
			user: req.user
		});
	});

// Endpoint handler for /settings
applicationRouter.get('/settings',
	login.ensureLoggedIn('/login'),
	function(req, res) {
		res.render('settings', {
			username: req.user._id
		});
	});

// Endpoint handler for /projects
applicationRouter.get('/projects',
	login.ensureLoggedIn('/login'),
	function(req, res) {
		login.ensureLoggedIn('/login'),
		res.send('Your username is ' + req.user._id+ ' and here are your projects');
	});

// Endpoint handlers for /projects/new
applicationRouter.get('/projects/new', function(req, res) {
	res.send('Making a new project');
});
applicationRouter.post('/projects/new', function(req, res) {
	res.redirect('/projects/new');
});

// Endpoint handler for a specific project
applicationRouter.get('/projects/:id', function(req, res) {
	res.send('Project: ' + req.params.id);
});



// Register all the routes (api routes start with /api/v1/)
app.use('/api/v1', apiRouter);
app.use('/', applicationRouter);

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
