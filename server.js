// Import packages
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var projectController = require('./controllers/project');

// Connect to the CMS MongoDB
mongoose.connect('mongodb://localhost:27017/cms');

// Create express application
var app = express();

// Use body-parser
app.use(bodyParser.urlencoded({
	extended: true
}));

// Use environment port or 3000
var port = process.env.PORT || 3000;

// Create router for express
var router = express.Router();

// Endpoint handlers for /projects
router.route('/projects')
	.post(projectController.postProjects)
	.get(projectController.getProjects);

// Endpoint handlers for /projects/:project_id
router.route('/projects/:project_id')
	.get(projectController.getProject)
	.put(projectController.putProject)
	.delete(projectController.deleteProject)

// Register all the routes to start with /api
app.use('/api/v1', router);

// Start the server
app.listen(port);
console.log('Started listening on port ' + port);