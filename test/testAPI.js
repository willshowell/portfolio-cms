// Set the environment to test
process.env.NODE_ENV = 'test'

// Import packages
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();

// Import server
var server = require('../app');

// Import models
var BlogPost = require('../models/blogPost');
var Project = require('../models/project');

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
	
	// Clear the database before any tests begin
	before(function(done) {
		BlogPost.collection.drop();
		done();
	});
	
	// Instantiate the database with a dummy post before each test
	beforeEach(function(done) {
		var longText = '';
		for (var i = 0; i < 400; i++) {
			longText += '!';
		}
		var newBlogPost = BlogPost({
			title: "My first blog post",
			text: longText
		});
		newBlogPost.save(function(err) {
			done();
		})
	});
	
	// Clear the database after each test
	afterEach(function(done) {
		BlogPost.collection.drop();
		done();
	});
	
	// Run tests
	it('should list all blog posts on /blogposts GET', function(done) {
		chai.request(server)
			.get(baseRoute + '/blogposts')
			.end(function(err, res) {
				
				// Test that returned object is correct
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('array');
				res.body.should.have.length(1);
				
				// Test that all data is available
				res.body[0].should.have.property('_id');
				res.body[0].should.have.property('title');
				res.body[0].should.have.property('short_text');
				
				// Test data is correct
				var longText = '';
				for (var i = 0; i < 300; i++) {
					longText += '!';
				}
				res.body[0].title.should.equal('My first blog post');
				res.body[0].short_text.should.equal(longText);
				
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