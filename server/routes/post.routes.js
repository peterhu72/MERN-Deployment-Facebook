const PostController = require("../controllers/post.controllers");

module.exports = (app) =>{
    app.get("/api/posts", PostController.findAllPosts)
    app.get("/api/posts/:id", PostController.findOnePost)
    app.post("/api/posts/:id/comments", PostController.addComment)
    app.put("/api/posts/:id", PostController.updateOnePost )
    app.delete("/api/posts/:id", PostController.deletePost)
}