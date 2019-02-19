/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

require('dotenv').config()
var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const mongoose = require ('mongoose');
const Book = require("../models/book.model");
mongoose.Promise = global.Promise;

module.exports = function (app) {

  mongoose.connect(process.env.DATABASE_URL, { 
    useNewUrlParser: true 
  }).then( () => {
    console.log("Successfully connected to database");
  }).catch(err => {
    console.log("Failed to connect to database. Exiting now. Error: ", err);
    process.exit();
  });

  app.route('/api/books')
    .get(function (req, res){
      Book.find({})
       .then( books => {
         const bookResults = [];
         //Add each book to results array and calculate comment length
         books.forEach(book => {
           bookResults.push({
            "_id": book.id,
            "title": book.title,
            "commentcount": book.comments.length
           });
         });

         res.send(bookResults);
       }).catch( err => {
         res.status(500).send({
           message: err.message || "Error occured in retrieving issues"
        });
       });
    })
    
    .post(function (req, res){
      var title = req.body.title;

      //Handle when user forgets to add a book title
      if(!title) {
        return res.status(500).send({message: "No title entered"});
      }
      
      const newBook = new Book({
        "title": title
      })

      newBook.save().then(
        book => {
          res.send({"title": book.title, "_id": book._id});
        }).catch(err => {
          res.status(500).send({
            message: err.message || "Error occured creating new book"
          });
        });
    })
    
    .delete(function(req, res){
      Book.deleteMany({})
      .then( books => {
        res.send( {message: "Deleted all books in library"} );
      })
      .catch(err => {
        res.status(500).send({
          message: err.message || "Error occured creating new book"
        });
      });
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      Book.findById(bookid, "_id title comments")
       .then( book => {
         //Handle incorrect ID
         if(!book) {
          return res.status(500).send("Book ID not found.");
        }
        //send success response if found
        return res.send( {
          "_id": book._id,
          "title": book.title,
          "comments": book.comments
        });
      })
       .catch( err => {
        if(err.kind === "ObjectId") {
          return res.status(500).send("Book ID not found.");
        }
        res.send({
          message: err.message || "Error deleting book"
       });
      });
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      
      Book.findByIdAndUpdate(bookid, {
        $push: { comments: comment }},
      {new: true})
       .then(book => {
        return res.send( {
          "_id": book._id,
          "title": book.title,
          "comments": book.comments
        });
      })
       .catch(err => {
        if(err.kind === "ObjectId") {
          return res.status(500).send("Book ID not found.");
        }
        res.send({
          message: err.message || "Error deleting book"
       });
      });
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;

      Book.findByIdAndDelete(bookid)
       .then( book => {
         //Handle incorrect ID
         if(!book) {
           return res.status(500).send("Book ID not found.");
         }
         //send success response if found
         return res.send("Successfully deleted book with id: " + bookid);
       })
       .catch( err => {
         if(err.kind === "ObjectId") {
           return res.status(500).send("Book ID not found.");
         }
         console.log(err.message);
         res.send({
           message: err.message || "Error deleting book"
        });
       });
    });
  
};
