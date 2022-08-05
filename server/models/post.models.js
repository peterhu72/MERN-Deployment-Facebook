const mongoose = require("mongoose");

const Post = mongoose.model("Post", new mongoose.Schema({
    imgUrl: {
        type: String,
        required: [true, "Picture is required"]
    },
    caption: {
        type: String,
        required: [true, "Caption is required"]
    },
    comments: [
        {
            type: String
        }
    ]
    }, {timestamps: true})
);

module.exports = Post;