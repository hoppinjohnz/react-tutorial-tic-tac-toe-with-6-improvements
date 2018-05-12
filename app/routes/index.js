// app/routes/index.js

// Other route groups could go here, in the future
const noteRoutes = require('./note_routes');

module.exports = function (app, db) {
    // export each specific routing function here
    noteRoutes(app, db);

    // Other route groups could go here, in the future
};