
//Import packages
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

//User schema
var UserSchema = new mongoose.Schema({
	username: {
		type: String,
		unique: true,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	client_id: {
		type: String,
		unique: true,
		required: true
	},
	secret: {
		type: String,
		required: true
	}
});

//this is gonna be called before user.save()

UserSchema.pre('save', function(cb){

	var user = this;

	//Stop if password and secret hasn´t changed
	if(!(user.isModified('password') | user.isModified('secret'))) return cb();

	//Hash password and secret if one of it changed

	bcrypt.genSalt(5, function(err, salt) {
	    if (err) return cb(err);

	    //hash password
	    bcrypt.hash(user.password, salt, null, function(err, hash) {
	      if (err) return cb(err);
	      user.password = hash;
	    });
	    //hash secret
	    bcrypt.hash(user.secret, salt, null, function(err, hash) {
	    	if(err) return cb(err);
	    	user.secret = hash;
	    });
	    cb();
	  });
});

//Verify PW

UserSchema.methods.verifyPassword = function(password, cb) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

UserSchema.methods.verifySecret = function(secret, cb) {
  bcrypt.compare(secret, this.secret, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};



module.exports = mongoose.model('User', UserSchema);


