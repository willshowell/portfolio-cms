// Import packages
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// Import other models
var Project = require('./project');
var BlogPost = require('./blogPost');

// User schema
var UserSchema = new mongoose.Schema({
	_id: {
		type: String
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
	},
	projects: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Project'
	}],
	blogposts: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'BlogPost'
	}]
});

// Make 'username' field a virtual field for the _id
/*UserSchema.virtual('username').get(function() {
	return this._id;
});*/

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
