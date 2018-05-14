// routing/routes/index.js

// Other route groups could go here, in the future
const noteRoutes = require('./note_routes');

// infrastructure: In Express, routes are wrapped in a function, which takes the Express
// instance and a database as arguments.
// Like this exported by index.js:
module.exports = function (app, db) {
    // export each specific routing function here
    noteRoutes(app, db);

    // Other route groups could go here, in the future
};