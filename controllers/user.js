// Import models

var User = require('../models/user');

//for creating new users
exports.newUser = function(req,res){

}

//changing user data
exports.changeUser = function(req,res){

}

//generating new secret and client_id 
//This function only generates it it has to be combined wirh changeuser() to save the new data
exports.generateCred = function(req,res){

}

//verify API Access
exports.apiAuthenticated = function(req,res){

}

//verify Interface Access
exports.interAuthenticated = function(req,res){

}

/*
These are test function to get started with express and mongoose

exports.newUser = function(req,res){
	var new_user = new User();

	new_user.username = req.body.username;
	new_user.password = req.body.password;


	new_user.save(function(err){
		if(err){
			res.send(err)
		}
		res.json({
			message: "User created",
			data: new_user
		});
	});
	console.log("new user should be generated");

};

exports.getUsers = function(req,res){
	User.find(function(err, users){
		if(err){
			res.send(err);
		}

		res.send(users);
		
	})
}
*/

