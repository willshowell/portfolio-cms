var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
var should = chai.should();

chai.use(chaiHttp);

var baseRoute = '/api/v1';

// Test /api/v1/projects functionality 
describe('Projects', function() {
	it('should list all projects on /projects GET');
	it('should list a single project on /projects/:id GET');
	it('should add a single project on /projects POST');
	it('should update a single project on /projects/:id PUT');
	it('should delete a single project on /projects/:id DELETE');
});

// Test /api/v1/blogposts functionality
describe('Blog Posts', function() {
	
	it('should list all blog posts on /blogposts GET', function(done) {
		chai.request(server)
			.get(baseRoute + '/blogposts')
			.end(function(err, res) {
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('array');
				done();
			});
	});
	
	it('should list a single blog post on /blogposts/:id GET');
	
	
	it('should add a single blog post on /blogposts POST', function(done) {
		chai.request(server)
			.post(baseRoute + '/blogposts')
			.send({'title': 'Blog Post Title', 'text': 'Some random blog text blah'})
			.end(function(err, res) {
				
				// Test that returned object is correct
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('object');
				res.body.should.have.property('message');
				res.body.message.should.equal('Blog post created');
				res.body.should.have.property('data');
				
				// Test that all data is available
				res.body.data.should.have.property('_id');
				res.body.data.should.have.property('title');
				res.body.data.should.have.property('text');
				res.body.data.should.have.property('created_at');
				res.body.data.should.have.property('updated_at');
				
				// Test data is correct
				res.body.data.title.should.equal('Blog Post Title');
				res.body.data.text.should.equal('Some random blog text blah');
				res.body.data.created_at.should.equal(res.body.data.updated_at);
				
				done();
			});
	});
	
	it('should update a single blog post on /blogposts/:id PUT');
	
	it('should delete a single blog post on /blogposts/:id DELETE');
});