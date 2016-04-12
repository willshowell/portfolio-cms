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

}

//generating new secret and client_id 
//This function only generates them it has to be combined with changeuser() to save the new data
exports.generateCred = function(req,res){

}

//verify API Access
exports.apiAuthenticated = function(req,res){

}

//verify Interface Access
exports.interAuthenticated = function(req,res){

}


