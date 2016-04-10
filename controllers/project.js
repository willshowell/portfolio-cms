// Import packages
var deleteKey = require('key-del');

// Import models
var Project = require('../models/project');


// Endpoint for POST /api/projects/
exports.postProjects = function(req, res) {
	// Create a new instance of a project
	var project = new Project();
	
	// Set the project parameters that came with the POST
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
		res.json({
			message: "Project created",
			data: project
		})
	});
};

// Endpoint for GET /api/projects
exports.getProjects = function(req, res) {
	// Find all the projects
	
	Project.find(function(err, projects) {
		if (err) {
			res.send(err);
		}

		var filteredProjects = [];

		projects.forEach(function(project, index) {
			var filteredProject = {
				_id: project._id,
				name: project.name,
				tagline: project.tagline,
				hero_url: project.hero_url
			};
			filteredProjects.push(filteredProject);
		});
		
		res.json(filteredProjects);
	});
};

// Endpoint for GET /api/projects/:project_id
exports.getProject = function(req, res) {
	// Find the specified project
	Project.findById(req.params.project_id, function(err, project) {
		if (err) {
			res.send(err);
		}
		res.json(project);
	});
};

// Endpoint for PUT /api/projects/:project_id
exports.putProject = function(req, res) {
	// Find the specified project
	Project.findById(req.params.project_id, function(err, project) {
		if(err) {
			res.send(err);
		}
		
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
			})
		});
			
	});
};

// Endpoint for DELETE /api/projects/:project_id
exports.deleteProject = function(req, res) {
	// Find the specified project and remote it
	Project.findByIdAndRemove(req.params.project_id, function(err) {
		if(err) {
			res.send(err);
		}
		res.json({
			message: "Project deleted"
		});
	});
};