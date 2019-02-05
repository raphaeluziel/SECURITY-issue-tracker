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

//const CONNECTION_STRING = process.env.MONGO_DB; 
//MongoClient.connect(CONNECTION_STRING, function(err, db) {});
mongoose.connect(process.env.MONGO_DB, { useNewUrlParser: true });

var Schema = mongoose.Schema;

var issueSchema = new Schema({
  project: {type: String, required: true},
  issue_title: {type: String, required: true},
  issue_text: {type: String, required: true},
  created_on: Date,
  updated_on: Date,
  created_by: {type: String, required: true},
  assigned_to: String,
  open: Boolean,
  status_text: String
});

var issueModel = mongoose.model('issueModel', issueSchema);

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
    
      var project = req.params.project;
    
      var query = issueModel.find({project: project})
      
      if(req.query._id) { query.where('_id').equals(req.query._id); }
      if(req.query.issue_title) { query.where('issue_title').equals(req.query.issue_title); }
      if(req.query.issue_text) { query.where('issue_text').equals(req.query.issue_text); }
      if(req.query.created_by) { query.where('created_by').equals(req.query.created_by); }
      if(req.query.assigned_to) { query.where('assigned_to').equals(req.query.assigned_to); }
      if(req.query.status_text) { query.where('status_text').equals(req.query.status_text); }
      if(req.query.open) { query.where('open').equals(req.query.open); }

      query.exec(function(err, data){
        if(err) {console.log('error executing');}
        res.send(data);
      });       
    
    })
    
    .post(function (req, res){
      var project = req.params.project; 
    
      if(!req.body.issue_title || !req.body.issue_text || !req.body.created_by) {
        res.send('missing inputs');
      }
    
      else{
        var newIssue = new issueModel({
            project: project,
            issue_title: req.body.issue_title, 
            issue_text: req.body.issue_text, 
            created_on: new Date(),
            updated_on: new Date(),
            created_by: req.body.created_by,
            assigned_to: req.body.assigned_to || "",
            open: true,
            status_text: req.body.status_text || ""
          });
          newIssue.save(function(err, data){                                      
            res.json({
              issue_title: data.issue_title, 
              issue_text: data.issue_text, 
              created_on: data.created_on,
              updated_on: data.updated_on,
              created_by: data.created_by,
              assigned_to: data.assigned_to,
              open: data.open,
              status_text: data.status_text,
              _id: data._id
            });                                 
          });
        }
      
    })
    
    .put(function (req, res){
      var project = req.params.project;

      if (!req.body.issue_title && 
          !req.body.issue_text && 
          !req.body.created_by && 
          !req.body.assigned_to && 
          !req.body.status_text && 
          !req.body.open){
        res.send('no updated field sent');
      }
      
    else{
        var query = issueModel.findOne({_id: req.body._id}, function(err, data){
          if(!data){
            res.send("could not update " + req.body._id);
          }
          else{
            issueModel.updateOne({ _id: req.body._id }, { $set: {
              _id: req.body._id || data._id,
              issue_title: req.body.issue_title || data.issue_title, 
              issue_text: req.body.issue_text || data.issue_text, 
              updated_on: new Date(),
              created_by: req.body.created_by || data.created_by,
              assigned_to: req.body.assigned_to || data.assigned_to,
              open: req.body.open || data.open,
              status_text: data.status_text || data.status_text,
            }}, function(){
              res.send('successfully updated');
            });
          }  
        });
    }
  })
    
    .delete(function (req, res){
      var project = req.params.project;
      
      if (!req.body._id) { res.send('_id error'); }
      else{
        issueModel.findOneAndDelete({_id: req.body._id}, function(err, data){
          if (err) { res.send('could not delete ' + data._id); }
          res.send('deleted ' + data._id);
        }); 
      }
    });
    
};