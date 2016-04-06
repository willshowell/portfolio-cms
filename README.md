# Portfolio CMS

A Node API for delivering structured projects to a portfolio site.


## Installation

1. First install [MongoDB](https://www.mongodb.org/) and run it with `mongod`. 
2. Then, make sure you have [Node](https://nodejs.org) installed.
3. Lastly, set up the project locally and start the server:

	$ git clone https://github.com/willshowell/porfolio-cms.git
	$ cd portfolio-cms
	$ npm install
	$ npm start


## Major TODO Tasks
* [ ] Configure tests
* [ ] Add users model
* [ ] Implement authentication
* [ ] Create front-end management tool
* [ ] Add image upload feature
 

## API Design

#### List Projects
 
	GET /api/v1/projects
	HTTP/1.1 200 OK
	[
	  {
	    "id": "123456abcd",
	    "name": "My Project",
	    "tagline": "ToDo app with Node.js",
	    "hero_url": "myupload.s3.awazonaws.com/project1.jpg"
	  },
	  {
	    "id": "789012wxyz",
	    "name": "Advanced Project",
	    "tagline": "Facebook emulator",
	    "hero_url": "myupload.s3.awazonaws.com/project2.jpg"
	  }
	]
	
#### Get Project Information
	GET /api/v1/projects/123456abcd
	HTTP/1.1 200 OK
	{
	  "id": "123456abcd",
	  "name": "My Project",
	  "tagline": "ToDo app with Node.js",
	  "description": "I built this app as an exercise to...",
	  "hero_url": "myupload.s3.awazonaws.com/project1.jpg",
	  "images": [
	    {"image_url": "myupload.s3.awazonaws.com/project1a.jpg"},
	    {"image_url": "myupload.s3.awazonaws.com/project1b.jpg"},
	    {"image_url": "myupload.s3.awazonaws.com/project1c.jpg"}
	  ],
	  "source_url": "github.com/username/todo-app",
	  "url": "todoapp.com",
	  "created_at": 1459873415,
	  "updated_at": 1459873415
	}

#### Create a new project
	POST /api/v1/projects
	{"args": "data"}

	HTTP/1.1 200 OK
	{
	  "message": "Project created"
	}

#### Edit a project
	PUT /api/v1/projects/:project_id
	{"updated_args": "data"}

	HTTP/1.1 200 OK
	{
	  "message": "Project updated",
	  "data": project_data
	}
	
#### Delete a project
	DELETE /api/v1/projects/:project_id

	HTTP/1.1 200 OK
	{
	  "message": "Project deleted"
	}