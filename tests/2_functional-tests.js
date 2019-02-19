/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

//Used for testing
let bookTestId;

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');

        bookTestId = res.body[0]._id; //Setup for later tests
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
         .post('/api/books')
         .send({
           title: '10 Ways to Appear Smarter in Meetings'
         })
         .end( (err, res) => {
           assert.equal(res.status, 200);
           assert.equal(res.body.title, '10 Ways to Appear Smarter in Meetings');
           done();
         });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
         .post('/api/books')
         .send({
           //Do not provide a title
         })
         .end( (err, res) => {
           assert.equal(res.status, 500);
           assert.equal(res.body.message, 'No title entered');
           done();
         })
      });
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
         .get('/api/books')
         .query({})
         .end(function(err, res) {
           assert.equal(res.status, 200);
           assert.property(res.body[0], '_id');
           assert.property(res.body[0], 'title');
           assert.property(res.body[0], 'commentcount')
           done();
         })
      });      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
         .get('/api/books/FakeIDToTest')
         .end(function(err, res) {
           assert.equal(res.status, 500);
           assert.equal(res.text, "Book ID not found.")
           done();
         })
      });  
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
         .get('/api/books/' + bookTestId)
         .end(function(err, res) {
           assert.equal(res.status, 200);
           assert.equal(res.body.title, '10 Ways to Appear Smarter in Meetings');
           assert.equal(res.body._id, bookTestId);
           done();
         })
      });
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
         .post('/api/books/' + bookTestId)
         .send({
           comment: 'New comment for testing'
         })
         .end(function(err, res) {
           assert.equal(res.status, 200);
           assert.equal(res.body._id, bookTestId);
           assert.equal(res.body.title, '10 Ways to Appear Smarter in Meetings');
           assert.equal(res.body.comments[0], 'New comment for testing');
           done();
         })
      });
      
    });

  });

});
