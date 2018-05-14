// config/db.js

// will be referred as db.url where this is imported
// export const url = 'mongodb://dbuser:dbusermima@ds119930.mlab.com:19930/notes-api-db';

// the old but not ES6 way:
module.exports = {
    url : 'mongodb://dbuser:dbusermima@ds119930.mlab.com:19930/notes-api-db'
};

// https://medium.freecodecamp.org/node-js-module-exports-vs-exports-ec7e254d63ac
// Think of module.exports as the variable that gets returned from require(). It is an
// empty object by default, and it is fine to change to anything.

// It is the object reference that gets returned from the require() calls.
// It is automatically created by Node.js.
// It is just a reference to a plain JavaScript object.
// It is also empty by default (our code attaches an “add()” method to it) like this:
//  module.exports.add = (a,b) => a+b