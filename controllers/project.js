// Import packages
var deleteKey = require('key-del');

// Import models
var Project = require('../models/project');
var User = require('../models/user');

// Import other controllers
var UserController = require('./user');

// Endpoint for POST /api/v1/:username/projects/
exports.postProjects = function(req, res) {

	// Get the user
	User.findById(req.params.username, function(err, user) {

		// Create a new project
		var project = new Project();
		
		// Set the project parameters that came with the POST
		project._user = user._id;
		project.name = req.body.name;
		project.tagline = req.body.tagline;
		project.hero_url = req.body.hero_url;
		project.description = req.body.description;
		project.source_url = req.body.source_url;
		project.project_url = req.body.project_url;
		project.images = req.body.images;

		// Save the project, checking for errors
		project.save(function(err) {
			if (err) {
				res.send(err);
			}	
	
			// Push the project to the user
			user.projects.push(project);
			user.save(function(err) {
				if (err) {
					res.send(err);
				}	
				res.json({
					message: "Project created",
					data: project
				});

			});
		});
	});
};

// Endpoint for GET /api/v1/:username/projects
exports.getProjects = function(req, res) {

	// Get the user
	User.findById(req.params.username, function(err, user) {
		if(err) {
			res.send(err);
		}

		// Get a list of all the projects for this user
		var projectList = user.projects;
	
		var filteredProjects = [];
		var projectsLeft = projectList.length;
	
		console.log(projectList);
		// Respond if there are no projects
		if (projectsLeft == 0) {
			finish();
		}
		// Find all the projects for this user
		projectList.forEach(function(project, index) {
			Project.findById(project, function(err, project) {
				if (err) {
					res.send(err);
				}
				var filteredProject = {
					_id: project._id,
					name: project.name,
					tagline: project.tagline,
					hero_url: project.hero_url
				};
				filteredProjects.push(filteredProject);
				finish();
			});
		});
		// TODO this is a lame way to do this. Should be a promise :/
		function finish() {
			projectsLeft -= 1;
			if(projectsLeft < 1) {
				res.json(filteredProjects);
			}
		};
	});
};

// Endpoint for GET /api/v1/:username/projects/:project_id
exports.getProject = function(req, res) {

	// Get the user
	User.findById(req.params.username, function(err, user) {
		if(err) {
			console.log(err);
			res.send(err);
		}

		// Find the specified project
		Project.findById(req.params.project_id, function(err, project) {
			if (err) {
				res.send(err);
			} else {
				res.json(project);
			}
		});
	});
};

// Endpoint for PUT /api/v1/:username/projects/:project_id
exports.putProject = function(req, res) {

	// Get the user
	User.findById(req.params.username, function(err, user) {

		// Find the specified project
		Project.findById(req.params.project_id, function(err, project) {
			if(err) {
				res.send(err);
			} else {
				// Update the values
				project.name = req.body.name || project.name;
				project.tagline = req.body.tagline || project.tagline;
				project.hero_url = req.body.hero_url || project.hero_url;
				project.description = req.body.description || project.description
				project.source_url = req.body.source_url || project.source_url
				project.project_url = req.body.project_url || project.project_url
				project.images = req.body.images || project.images
				
				// Save the project
				project.save(function(err) {
					if (err) {
						res.send(err);
					}
					res.json({
						message: "Project updated",
						data: project
					});
				});
			}	
		});
	});
};

// Endpoint for DELETE /api/v1/:username/projects/:project_id
exports.deleteProject = function(req, res) {

	// Get the user
	User.findById(req.params.username, function(err, user) {

		// Find the specified project and remove it
		Project.findByIdAndRemove(req.params.project_id, function(err) {
			if(err) {
				res.send(err);
			} else {
				var projectIndex = user.projects.indexOf(req.params.project_id);
				user.projects.splice(projectIndex, 1);
				user.save(function(err) {
					if (err) {
						res.send(err);
					}	
					res.json({
						message: "Project deleted",
					});
				});
			}
		});
	});
};
