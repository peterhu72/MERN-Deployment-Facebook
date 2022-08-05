const UserController = require("../controllers/user.controllers");

module.exports = (app) =>{
    app.get("/api/users", UserController.getAllUsers)
    app.get("/api/users/get/:id", UserController.findOneUser)
    app.get("/api/users/getloggedinuser", UserController.getLoggedInUser)
    app.get("/api/users/logout", UserController.logout)

    app.post("/api/users/register", UserController.register )
    app.post("/api/users/login", UserController.login)
    app.post("/api/users/add/:id/:friend", UserController.addFriend)
    
    app.put("/api/users/:id", UserController.updateOneUser)
    
    app.delete("/api/users/:id", UserController.deleteUser)

    app.post("/api/users/:id/posts", UserController.createNewPost)
}