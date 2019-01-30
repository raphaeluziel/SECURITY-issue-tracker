/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
var mongoose = require('mongoose');

const CONNECTION_STRING = process.env.MONGO_DB; 
//MongoClient.connect(CONNECTION_STRING, function(err, db) {});
mongoose.connect(process.env.MONGO_DB, { useNewUrlParser: true });

var Schema = mongoose.Schema;

var issueSchema = new Schema({
  issue_title: {type: String, required: true},
  issue_text: {type: String, required: true},
  created_by: {type: String, required: true},
  assigned_to: String,
  status_text: String
});

var issueModel = mongoose.model('issueModel', issueSchema);

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      var project = req.params.project;
      
    })
    
    .post(function (req, res){
      var project = req.params.project;
      //console.log(req.body.issue_title);
      
      var query = issueModel.findOne({issue_title: project}, function(err, data){
        // If issue is not in the database add it
        if(!data){
          //console.log(req.body.issue_title, req.body.issue_text, req.body.created_by);
          var newIssue = new issueModel({
            issue_title: req.body.issue_title, 
            issue_text: req.body.issue_text, 
            created_by: req.body.created_by,
            assigned_to: req.body.assigned_to,
            status_text: req.body.status_text
          });
          newIssue.save(function(err, data){
            res.json({message: "all ok"});
          //console.log("issue has been saved to the database!");
          });
        }
        else{
          console.log("SOMETHING WRONG!");
        }
        
      });
      
    })
    
    .put(function (req, res){
      var project = req.params.project;
      
    })
    
    .delete(function (req, res){
      var project = req.params.project;
      
    });
    
};
