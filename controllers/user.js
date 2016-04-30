// Import models
var User = require('../models/user');

// Import packages
var passport = require('passport');
var Strategy = require('passport-http').BasicStrategy;
var keygen = require("generate-key");

var secretLength = 24;

// Create new users
exports.newUser = function(req,res) {
	
	// Generate new user object
	var user = new User();
	
	// Generate new secret for the user
	var secret = keygen.generateKey(secretLength);

	// Set object properties
	user._id = req.body.username;
	user.password = req.body.password;
	user.secret = secret;
	if (req.body.email){
		user.email = req.body.email;
	}
	
	// Save the new user to the database
	User.findById(user._id, function(err, existingUser) {
		
		// Return if user already exists
		if (existingUser) {
			res.json({
				message: "User already exists",
				data: null
			});
			return;
		}
		
		// Otherwise, save
		user.save(function(err) {
			if (err) {
				res.send(err);
				console.log(err);
				return;
			}
			res.json({
				message: "User created",
				data: user
			});
			return;
		});
	});
}

// Update user data
exports.updateUser = function(req,res) {

	User.update({'username' : req.body.username}, { 
		$set: {
			username : req.body.username,
			password : req.body.password,
			secret : req.body.secret,
		}
	}, function(err) {
		if (err) {
			res.send(err);
			console.log(err);
			return;
		}
		res.json({
			message: "User Changed",
			data: user
		});
		return;
	});
}

// Generate a new secret for a user
exports.newSecret = function(req,res) {

	var new_secret = keygen.generateKey(secretLength);

	User.update({'username' : req.body.username}, {
		$set: {
			'secret' : new_secret
		}
	}, function(err) {
		if (err) {
			res.send(err);
			console.log(err);
			return;
		}
		res.json({
			message: "New secret generated",
			data: {
				secret: new_secret
			}
		});
	});
}

// Verify API Access
exports.apiAuthenticated = passport.authenticate('api', {
	session : false
});

// Verify Application Access
exports.applicationAuthenticated = passport.authenticate('application', {
	session : true
});

// Passport authentication for the API 
passport.use('api', new Strategy(function(username, secret, cb) {

	User.findOne({'username': username}, function(err, username) {

		if (err) {
			console.log(err);
			return cb(err);
		} 

    // No user found with that username
  	if (!username) {
  		console.log(err);
  		return cb(null, false);
  	}

    // Make sure the secret matches the user
    username.verifySecret(secret, function(isMatch) {

      // Password did not match
      if (!isMatch) { 
      	return cb(null, false); 
      }

      // Success
      return cb(null, username);
  	});
	});
}));

// Passport authentication for the application
passport.use('application', new Strategy(function(username, password, cb) {
	
	User.findById(username, function(err, user) {

		if (err) {
			console.log(err);
			return cb(err);
		}

		// No user found with that username
		if (!user) {
			console.log(err);
			return cb(null, false);
		}

		// Make sure password is correct
		user.verifyPassword(password, function(err, isMatch){
			
			if (err) {
				return cb(err);
			}

			// Password doesnt match
			if(!isMatch) return cb(null,false);

			// Success
			return cb(null, username);
		});
	});
}));
