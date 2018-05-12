// server.js

const express = require('express');
// You’re going to use the MongoClient to interact with your database. 
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const myDb = require('./config/db');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: true }));

MongoClient.connect(myDb.url, (err, database) => {
  if (err) {
    return console.log(err);
  }

  // Make sure you add the database name and not the collection name
  let db = database.db('notes-api-db');

  // import all the exported routing functions
  require('./app/routes')(app, db);

  app.get('/api/hello', (req, res) => {
    res.send({ mymsg: 'Sent by Express server!!!' });
  });
  // to start listening for HTTP requests on port 8000
  app.listen(port, () => {
    console.log('We are live on ' + port);
  });
})
