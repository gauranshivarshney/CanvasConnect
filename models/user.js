const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/postdata");

const userSchema = mongoose.Schema({
    username: String,
    name: String,
    email: String,
    password: String,
    profilepic: {
        type: String,
        default: "profile.png"
    }
})
module.exports = mongoose.model('user', userSchema);