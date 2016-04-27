// Import packages
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// User schema
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
	secret: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: false // TODO maybe make req'd for password reset functionality
	}
});

// This is called before each user.save()
UserSchema.pre('save', function(cb) {

	var user = this;

	// Stop if password hasn´t changed
	if (!user.isModified('password')) {
		return cb();
	}

	// Hash password if it changed
	bcrypt.genSalt(5, function(err, salt) {
    if (err) {
    	return cb(err);
    }

    // Hash password
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) {
      	return cb(err);
      }
      user.password = hash;
      cb();
    });
  });
});

// Verify password
UserSchema.methods.verifyPassword = function(password, cb) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    if (err) {
    	return cb(err);
    }
    cb(null, isMatch);
  });
};

// Verify secret
UserSchema.methods.verifySecret = function(secret, cb) {
  if(this.secret == secret) {
  	return cb(true);
  }
  else {
  	return cb(false);
  }
};

module.exports = mongoose.model('User', UserSchema);
