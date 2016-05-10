## Secret
Whenver a user signs up with for an account, they will be issued a _secret_ that
corresponds with their username. I will need to be included with all API
requests in order to verify content ownership.

#### GET
The secret should be included in the query string as `secret`.
For example,
```
GET /api/v1/fakeuser/projects?secret=mysupersecretcode
```

#### POST, PUT, DELETE
The secret should be included in the body as `secret`.
For example,
```
POST /api/v1/fakeuser/blogposts
secret=mysupersecretcode
```
