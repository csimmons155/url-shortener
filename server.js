var express = require("express");
var path = require("path");
var mongo = require("mongodb");
var api = require("./app/api/shorten.js");

require("dotenv").config({silent : true}); 
var app = express(); 

mongo.MongoClient.connect(process.env.MONGOLAB_URI || 'mongodb://localhost:27017/url-shortener', function(err,db){
    if (err){
        console.log("Error: cannot connect to db");
    } else {
        console.log("Connected to db");
    }
    
    app.set("views", path.join(__dirname, 'views'));
    app.set("view engine", 'jade');
    
    
    db.createCollection("websites", {capped: true, size: 5242880, max: 5000});
    
    api(app, db)
    
    var port = process.env.PORT || 8080;
    
    app.listen(port);
    
    
    
});
