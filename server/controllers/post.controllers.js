const Post = require("../models/post.models")

module.exports.findAllPosts = (req, res) => {
    Post.find()
        .then(allPosts =>{
            res.json({results: allPosts})
        })
        .catch(err =>{
            res.json(err)
        })
}

module.exports.findOnePost = (req, res) => {
    Post.findOne({_id: req.params.id})
        .then(post =>{
            res.json({results: post})
        })
        .catch(err =>{
            res.json(err)
        })
}

module.exports.updateOnePost = (req, res) => {
    Post.findOneAndUpdate(
        {_id: req.params.id},
        req.body,
        { new: true, runValidators: true}
    )
        .then(updatePost =>{
            res.json({results: updatePost})
        })
        .catch(err => {
            res.json(err)
        })
}

module.exports.deletePost = (req, res) => {
    Post.deleteOne({_id: req.params.id})
        .then(post =>{
            res.json({results: post})
        })
        .catch(err =>{
            res.json(err)
        })
}

module.exports.addComment = (req, res) => {
    Post.updateOne(
        {_id: req.params.id},
        {
            $push : {
                comments: {
                    _id: req.body.comment
                }
            }
        }
    )
        .then(newComment => {
            res.json(newComment)
        })
        .catch(err => {
            res.json(err)
        })
}