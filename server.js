// server.js

const express = require('express');
// You’re going to use the MongoClient to interact with your database. 
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const myDb = require('./config/db');

// initialize the server app as an instance of Express
const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: true }));

MongoClient.connect(myDb.url, (err, database) => {
  if (err) {
    return console.log(err);
  }

  // add the database name and not the collection name here
  let db = database.db('notes-api-db');

  // import all the exported routing functions to work with ours
  require('./routing/routes')(app, db);

  // to start listening for HTTP requests on port 5000
  app.listen(port, () => {
    console.log('API server lives on ' + port);
  });
})
