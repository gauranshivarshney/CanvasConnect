const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI);

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