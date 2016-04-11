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
		});
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
				var shortText = '';
				for (var i = 0; i < 300; i++) {
					shortText += '!';
				}
				res.body[0].title.should.equal('My first blog post');
				res.body[0].short_text.should.equal(shortText);
				
				done();
			});
	});
	
	it('should list a single blog post on /blogposts/:id GET', function(done) {
		var longText = '';
		for (var i = 0; i < 400; i++) {
			longText += '~';
		}
		var newBlogPost = BlogPost({
			title: "My second blog post",
			text: longText
		});
		newBlogPost.save(function(err, data) {
			chai.request(server)
				.get(baseRoute + '/blogposts/' + data.id)
				.end(function(err, res) {
					
					// Test that returned object is correct
					res.should.have.status(200);
					res.should.be.json;
					res.body.should.be.a('object');
					
					// Test that all data is available
					res.body.should.have.property('_id');
					res.body.should.have.property('title');
					res.body.should.have.property('text');
					
					// Test data is correct
					res.body._id.should.equal(data.id);
					res.body.title.should.equal('My second blog post');
					res.body.text.should.equal(longText);
					res.body.created_at.should.equal(res.body.updated_at);
					
					done();
				});
		});
	});
	
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
	
	it('should update a single blog post on /blogposts/:id PUT', function(done) {
		chai.request(server)
			.get(baseRoute + '/blogposts')
			.end(function(err, res) {
				chai.request(server)
					.put(baseRoute + '/blogposts/' + res.body[0]._id)
					.send({'title': 'The History of the World'})
					.end(function(error, response) {
						
						// Test that returned object is correct
						response.should.have.status(200);
						response.should.be.json;
						response.body.should.be.a('object');
						response.body.should.have.property('message');
						response.body.message.should.equal('Blog post updated');
						response.body.should.have.property('data');
						
						// Test that all data is available
						response.body.data.should.have.property('_id');
						response.body.data.should.have.property('title');
						response.body.data.should.have.property('text');
						response.body.data.should.have.property('created_at');
						response.body.data.should.have.property('updated_at');
						
						// Test data is correct
						var new_updated_at = response.body.data.updated_at;
						response.body.data.title.should.equal('The History of the World');
						response.body.data.created_at.should.not.equal(new_updated_at);
					
						done();
					});
			});
	});
	
	it('should delete a single blog post on /blogposts/:id DELETE', function(done) {
		chai.request(server)
			.get(baseRoute + '/blogposts')
			.end(function(err, res) {
				
				chai.request(server)
					.delete(baseRoute + '/blogposts/' + res.body[0]._id)
					.end(function(error, response) {
						
						// Test that returned object is correct
						response.should.have.status(200);
						response.should.be.json;
						response.body.should.be.a('object');
						response.body.should.have.property('message');
						response.body.message.should.equal('Blog post deleted');
						
						chai.request(server)
							.get(baseRoute + '/blogposts')
							.end(function(error_, response_) {
								
								// Test that no blog posts remain
								response.should.have.status(200);
								response.should.be.json;
								response.body.should.be.a('array');
								response.body.should.have.length(0);
							});
						
						done();
					});
			});
	});
});
