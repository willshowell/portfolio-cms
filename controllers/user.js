
// Import models

var User = require('../models/user');
//middleware for auth.
var passport = require('passport');
var Strategy = require('passport-http').BasicStrategy;
//random key generator
var keygen = require("generate-key");

//for creating new users
exports.newUser = function(req,res){
	console.log("function called");
	var user = new User();
	var secret = keygen.generateKey('24');

	user.username = req.body.username;
	user.password = req.body.password;
	user.secret = secret;

	console.log(req.body);

	//TODO adding validation if client_id already exists

	User.findOne({'username' : user.username},'username',function(err,username){


		console.log("test");

		if(username){
			res.json({
				message: "User already exists",
				data: null
			});
			return;
		}

		user.save(function(err){

			if(err){
				res.send(err);
				console.log(err);
				return;
			}
			res.json({
				message: "User created",
				data: user
			});
			console.log("new user generated");
			return;
		});
	});
	
	
}



//changing user data
exports.changeUser = function(req,res){

	User.update({'username' : req.body.username}, { $set: {
			username : req.body.username,
			password : req.body.password,
			secret : req.body.secret,
		}
	}, function(err){
		if(err){
			res.send(err);
			console.log(err);
			return;
		}
		res.json({
			message: "User Changed",
		});
		console.log("user changed");
		return;
	});

}

//generating new secret and client_id and saving it in the DB
exports.newSecret = function(req,res){

	//TODO adding validation if client_id already exists

	var new_secret = keygen.generateKey('24');

	User.update({'username' : req.body.username}, { $set: {
		'secret' : new_secret
	}},function(err){
		if(err){
			res.send(err);
			console.log(err);
			return;
		}
		res.json({
			message: "New Secret and Client_ID stored",
			data: {
				secret: new_secret
			}
		});
	});
}

//verify API Access
exports.apiAuthenticated = passport.authenticate('api_basic', { session : false });

//verify Interface Access
exports.interAuthenticated = passport.authenticate('interface', {session: false});


//Passport functions

//passport for api 
passport.use('api_basic', new Strategy(
	function(username, secret, cb){

		User.findOne({'username': username},function(err, username){

			if (err){
				console.log(err + "1");
				return cb(err);
			} 

	      // No user found with that username
	      	if (!username) {
	      		console.log(err + "2");
	      		return cb(null, false);
	      	}

	      // Make sure the secret is correct
	      username.verifySecret(secret, function(isMatch) {
	        console.log("secret");

	        // Password did not match
	        if (!isMatch) { return cb(null, false); }

	        // Success
	        return cb(null, username);
      		});
		})
	}
));

//passport for interface 
passport.use('interface', new Strategy(
	function(username, password, cb){
		User.findOne({'username': username},function(err, username){
			if (err){
				console.log(err);
				return cb(err);
			}

			//No User found
			if(!username){
				console.log(err);
				return cb(null,false);
			}

			//Make sure password is correct
			username.verifyPassword(password, function(err,isMatch){
				
				if(err) return cb(err);

				//password doesnt match
				if(!isMatch) return cb(null,false);

				//Success
				return cb(null, username);

			})
		})
	}))










