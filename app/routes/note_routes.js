// app/routes/note_routes.js

var ObjectID = require('mongodb').ObjectID;

// In Express, routes are wrapped in a function, 
// which takes the Express instance and a database as arguments.
// You can then export this function through your index.js.
// Then import it for use in server.js.
module.exports = function (app, db) {

    // When the app receives a post request to the ‘/notes’ path, 
    // it will execute the code inside the callback - passing in a request object 
    // (which contains the parameters or JSON of the request) and a response object (used to reply).
    // You can test this by using Postman to send a POST request to localhost:8000/notes.
    app.post('/notes', (req, res) => {
        const note = { title: req.body.title, body: req.body.body, date: new Date().toString()};
        db.collection('notes').insert(note, (err, result) => {
            if (err) {
                res.send({ 'error': 'An error has occurred' });
            } else {
                res.send(result.ops[0]);
            }
        });
    });

    app.get('/notes/:id', (req, res) => {
        const id = req.params.id;
        const details = { '_id': new ObjectID(id) };
        db.collection('notes').findOne(details, (err, item) => {
            if (err) {
                res.send({ 'error': 'An error has occurred' });
            } else {
                res.send(item);
            }
        });
    });
      
    app.put('/notes/:id', (req, res) => {
        const id = req.params.id;
        const details = { '_id': new ObjectID(id) };
        const note = { body: req.body.body, title: req.body.title };
        db.collection('notes').update(details, note, (err, result) => {
            if (err) {
                res.send({ 'error': 'An error has occurred' });
            } else {
                res.send(note);
            }
        });
    });

    app.delete('/notes/:id', (req, res) => {
        const id = req.params.id;
        const details = { '_id': new ObjectID(id) };
        db.collection('notes').remove(details, (err, item) => {
            if (err) {
                res.send({ 'error': 'An error has occurred' });
            } else {
                res.send('Note ' + id + ' deleted!');
            }
        });
    });

};
