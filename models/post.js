const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/postdata");

const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    content: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const postSchema = mongoose.Schema({
    title: String,
    content: String,
    image: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    likes: {
        type: Number,
        default: 0
    },
    likedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    comments: [commentSchema]
});

module.exports = mongoose.model('post', postSchema);