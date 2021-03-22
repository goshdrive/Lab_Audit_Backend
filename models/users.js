var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    // username: {
    //     type: String,
    //     required: true,
    //     unique: true
    // },
    // password: {
    //     type: String,
    //     required: true
    // },
    firstName: {
        type: String,
        default: ''
    },
    lastName: {
        type: String,
        default: ''
    },
    supervisor: {
        type: Boolean,
        default: false
    }
});

User.plugin(passportLocalMongoose); // adds automatically username and password (hashed)

module.exports = mongoose.model('User', User);

