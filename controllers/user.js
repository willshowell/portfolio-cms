
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
	var client_id = keygen.generateKey('7');
	var secret = keygen.generateKey('16');

	user.username = req.body.username;
	user.password = req.body.password;
	user.client_id = client_id;
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
			client_id : req.body.client_id,
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
exports.generateCred = function(req,res){

	//TODO adding validation if client_id already exists

	var new_client_id = keygen.generateKey('7');
	var new_secret = keygen.generateKey('16');

	User.update({'username' : req.body.client_id}, { $set: {
		'client_id' : new_client_id,
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
				client_id: new_client_id,
				secret: new_secret
			}
		});
	});
}

//verify API Access
exports.apiAuthenticated = passport.authenticate('api_basic', { session : false });

//verify Interface Access
exports.interAuthenticated = function(req,res){

}


//Passport functions

passport.use('api_basic', new Strategy(
	function(client_id, secret, cb){
		User.findOne({'client_id': client_id},function(err, client_id){

			if (err){
				console.log(err + "1");
				return cb(err);
			} 

	      // No user found with that username
	      	if (!client_id) {
	      		console.log(err + "2");
	      		return cb(null, false);
	      	}

	      // Make sure the secret is correct
	      client_id.verifySecret(secret, function(err, isMatch) {
	        
	        if (err) {
	        	console.log(err + "3"); 
	        	return cb(err); 
	        }

	        // Password did not match
	        if (!isMatch) { return cb(null, false); }

	        // Success
	        return cb(null, client_id);
      		});
		})
	}
));










