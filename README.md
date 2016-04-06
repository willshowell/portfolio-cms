# Portfolio CMS

A Node API for delivering structured projects to a portfolio site.


### Installation

1. First install [MongoDB](https://www.mongodb.org/) and run it with `mongod`
2. Then, make sure you have [Node](https://nodejs.org) installed
3. Lastly, set up the project locally and start the server:

```
$ git clone https://github.com/willshowell/porfolio-cms.git
$ cd portfolio-cms
$ npm install
$ npm start
```

### Major TODO Tasks
* [ ] Configure tests
* [ ] Add users model
* [ ] Implement authentication
* [ ] Create front-end management tool
* [ ] Add image upload feature
* [ ] Extend functionality for markdown blog posts
 

### API Design

##### List Projects
 
```http
GET /api/v1/projects
```
```json
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
```
	
##### Get Project Information
```http
GET /api/v1/projects/123456abcd
```
```json
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
```

##### Create a new project
```http
POST /api/v1/projects
```
```json
HTTP/1.1 200 OK
{
  "message": "Project created",
  "data": project_data
}
```

##### Edit a project
```http
PUT /api/v1/projects/:project_id
```
```json
{
  "message": "Project updated",
  "data": project_data
}
```
	
##### Delete a project
```http
DELETE /api/v1/projects/:project_id
```
```json
{
  "message": "Project deleted"
}
```
