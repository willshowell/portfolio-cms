var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

// Configure local authentication strategy 
passport.use(new LocalStrategy(
	function(username, password, done) {
		User.findById(username, function(err, user) {
			if (err) { return done(err); }
			if (!user) {
				return done(null, false);
			}
			user.verifyPassword(password, function(err, isMatch) {
				if (err) { return done(err); }
				if (!isMatch) {
					return done(null, false);
				}
				return done(null, user);
			});
		});
	}
));	

// Serialize and deserialize user session
passport.serializeUser(function(user, cb) {
	cb(null, user._id);
});
passport.deserializeUser(function(id, cb) {
	User.findById(id, function(err, user) {
		if (err) { return cb(err); }
		cb(null, user);
	});
});

exports.appAuthenticated = passport.authenticate('local', {
	successReturnToOrRedirect: '/',
	failureRedirect: '/login'
});

// Make sure user properly provides their secret in their request
exports.apiAuthenticated = function(req, res, next) {
	// Find the secret
	var providedSecret = req.body.secret || req.query.secret || null;
	if (!providedSecret) {
		res.json({
			message: "Secret not provided."
		});
		return;
	}
	// Verify the secret
	User.findById(req.params.username, function(err, user) {
		if(err) { next(err); }
		if (!user) {
			res.json({
				message: "User does not exist."
			});
			return;
		}
		user.verifySecret(providedSecret, function(isMatch) {
			if (!isMatch) {
				res.json({
					message: "Wrong secret"
				});
				return;
			}
			req.user = user;
			next();	
		});	
	});
};

exports.projectOwnership = function(req, res, next) {
	var projectIndex = req.user.projects.indexOf(req.params.id);
	if (projectIndex == -1) {
		res.json({
			message: "Project does not belong to you"
		});
		return;
	}
	next();
}

exports.contentOwnership = function(req, res, next) {
	var contentIndex = req.user.projects.indexOf(req.params.id);
	if (contentIndex == -1) {
		contentIndex = req.user.blogposts.indexOf(req.params.id);
	}
	if (contentIndex == -1) {
		res.json({
			message: "Content does not belong to you"
		});
		return;
	}
	next();
}
