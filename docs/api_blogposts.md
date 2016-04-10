#### List blog posts
 
```http
GET /api/v1/blogposts
```
```json
[
  {
    "_id": "570a6bb10fe400a43fbb572c",
    "title": "My First Post",
    "short_text": "Today was a bad day, and I think..."
  },
  {
    "_id": "570a6bd40fe400a43fbb572d",
    "title": "My Second Blog Post",
    "short_text": "Understanding the difference bet..."
  }
]
```
> Note: `short_text` returns the first *300* characters of a blog post
	
#### Get a full blog post
```http
GET /api/v1/blogposts/570a6bb10fe400a43fbb572c
```
```json
{
  "_id": "570a6bb10fe400a43fbb572c",
  "title": "My First Post",
  "text": "Today was a bad day, and I think the reason why is because..."
  "created_at": "2016-04-09T11:32:39.464Z",
  "updated_at": "2016-04-10T15:05:21.346Z"
}
```

#### Create a new blog post
```http
POST /api/v1/blogposts
```
```json
HTTP/1.1 200 OK
{
  "message": "Blog post created",
  "data": {}
}
```

#### Edit a blog post
```http
PUT /api/v1/blogposts/:blogpost_id
```
```json
{
  "message": "Blog post updated",
  "data": {}
}
```
	
#### Delete a blog post
```http
DELETE /api/v1/blogposts/:blogpost_id
```
```json
{
  "message": "Blog post deleted"
}
```