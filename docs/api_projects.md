#### List projects
 
```http
GET /api/v1/projects
```
```json
[
  {
    "_id": "570a6bb10fe400a43fbb572c",
    "name": "My Project",
    "tagline": "ToDo app with Node.js",
    "hero_url": "myupload.s3.awazonaws.com/project1.jpg"
  },
  {
    "_id": "570a6bd40fe400a43fbb572d",
    "name": "Advanced Project",
    "tagline": "Facebook emulator",
    "hero_url": "myupload.s3.awazonaws.com/project2.jpg"
  }
]
```
	
#### Get full project information
```http
GET /api/v1/projects/570a6bb10fe400a43fbb572c
```
```json
{
  "_id": "570a6bb10fe400a43fbb572c",
  "name": "My Project",
  "tagline": "ToDo app with Node.js",
  "description": "I built this app as an exercise to...",
  "hero_url": "myupload.s3.awazonaws.com/project1.jpg",
  "images": [
    "myupload.s3.awazonaws.com/project1a.jpg",
    "myupload.s3.awazonaws.com/project1b.jpg",
    "myupload.s3.awazonaws.com/project1c.jpg"
  ],
  "source_url": "github.com/username/todo-app",
  "project_url": "todoapp.com",
  "created_at": "2016-04-09T11:32:39.464Z",
  "updated_at": "2016-04-10T15:05:21.346Z"
}
```

#### Create a new project
```http
POST /api/v1/projects
```
```json
HTTP/1.1 200 OK
{
  "message": "Project created",
  "data": {}
}
```

#### Edit a project
```http
PUT /api/v1/projects/:project_id
```
```json
{
  "message": "Project updated",
  "data": {}
}
```
	
#### Delete a project
```http
DELETE /api/v1/projects/:project_id
```
```json
{
  "message": "Project deleted"
}
```