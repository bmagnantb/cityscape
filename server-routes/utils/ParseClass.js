var Parse = require('parse').Parse

// when photo entry is created, add user votes, total votes, and tag votes
var Photo = Parse.Object.extend('Photo')


module.exports.Photo = Photo

