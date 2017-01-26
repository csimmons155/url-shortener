var express = require("express");
var path = require("path");
var mongo = require("mongodb");

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
    
})
