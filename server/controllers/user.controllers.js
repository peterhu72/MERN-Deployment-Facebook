const User = require("../models/user.models")
const Post = require("../models/post.models")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

class UserController{
    getAllUsers = (req, res) => {
        User.find()
            .populate("posts")
            .then(allUsers =>{
                res.json({results: allUsers})
            })
            .catch(err =>{
                res.json(err)
            })
    }

    register = (req, res) => {
        User.find({email:req.body.email})
            .then(usersWithEmail=>{
                console.log("response when finding user", usersWithEmail)
                if(usersWithEmail.length ===0){ //this means the email is not yet taken and we can create a user with this email
                    User.create(req.body)
                    .then(user => {
                        //when the .then() happens that means taht the user from the form was successsfully created and is stored in that variable "user" which has info about the user that was just put into the db, including the field _id
                        const userToken= jwt.sign({
                            id: user._id,
                            firstName: user.firstName
                        }, process.env.SECRET_KEY);
                
                        //respond with a cookie called "usertoken" which contains the JWT from above called userTokenJWT AND also respond with json with info abou the user who just got created
                        res
                            .cookie("usertoken", userToken, process.env.SECRET_KEY, {
                                httpOnly: true
                            })
                            .json({ msg: "success!", user: user });
                    })
                    .catch(err => res.json(err));
                }else{
                    //else --> the email is already taken so we will send back an error message
                    res.json({errors: {email:{message:"Email is taken!"}}})
                }
            })
            .catch(err=>console.log("errr!", err))

        
    }

        login = async(req, res) => {
            const user = await User.findOne({ email: req.body.email }); //see if the user exists in db
    
            if(user === null) {
                // email not found in users collection
                return res.json({error: "User not found."})
            }
        
            // if we made it this far, we found a user with this email address
            // let's compare the supplied password to the hashed password in the database
            const correctPassword = await bcrypt.compare(req.body.password, user.password);
        
            if(!correctPassword) {
                // password wasn't a match!
                return res.json({error: "Password is incorrect!"})
            }
        
            // if we made it this far, the password was correct
            const userToken = jwt.sign({
                id: user._id,
                firstName: user.firstName
            }, process.env.SECRET_KEY);
    
            // note that the response object allows chained calls to cookie and json
            res
                .cookie("usertoken", userToken, process.env.SECRET_KEY, {
                    httpOnly: true
                })
                .json({ msg: "success!" });
        }

    logout = (req, res) => {
        res.clearCookie('usertoken')
        res.sendStatus(200)
    }

    getLoggedInUser = (req,res)=>{
        //use the info stored in the cookie to get the id of the logged in user and query the db to find a user with that id, and return with info about the logged in user
        const decodedJWT = jwt.decode(req.cookies.usertoken, {complete:true})
        // decodedJWT.payload.id
        User.findOne({_id: decodedJWT.payload.id })
            .populate("posts")
            .then(foundUser=>{
                res.json({results: foundUser})
            })
            .catch(err=>{
                res.json(err)
            })
    }

    deleteUser = (req, res) => {
        User.deleteOne({_id: req.params.id})
            .then(user =>{
                res.json({results: user})
            })
            .catch(err =>{
                res.json(err)
            })
    }

    findOneUser = (req, res) => {
        User.findOne({_id: req.params.id})
            .populate("posts")
            .then(user =>{
                res.json({results: user})
            })
            .catch(err =>{
                res.json(err)
            })
    }

    updateOneUser = (req, res) => {
        User.findOneAndUpdate(
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

    createNewPost = (req, res) => {
        Post.create(req.body)
            .then(docPost => {
                User.findByIdAndUpdate(
                    {_id: req.params.id}, 
                    { 
                        $push: { 
                            posts: {
                                _id: docPost._id
                            }
                        } 
                    },
                    { new: true, useFindAndModify: false }
                )
                    .then(updatedUser => {
                        res.json({result: updatedUser})
                    })
                    .catch (err => {
                        res.json(err)
                    })
        })
        .catch (err =>{
                res.json(err)
        });
    }

    addFriend = (req, res) => {
        User.updateOne(
            {_id: req.params.id}, 
            {
                $push : {
                    friends: {
                        _id: req.params.friend
                    }
                }
            }
        )
            .then(newFriend => {
                res.json(newFriend)
            })
            .catch(err => {
                res.json(err)
            })
    }

}

module.exports = new UserController();

// module.exports.createNewPirate = (req, res) => {
//     Pirate.create(req.body)
//         .then(newPirate =>{
//             res.json({results: newPirate})
//         })
//         .catch(err =>{
//             res.json(err)
//         })
// }

// module.exports.findOnePirate = (req, res) => {
//     Pirate.findOne({_id: req.params.id})
//         .then(pirate =>{
//             res.json({results: pirate})
//         })
//         .catch(err =>{
//             res.json(err)
//         })
// }

// module.exports.updateOnePirate = (req, res) => {
//     Pirate.findOneAndUpdate(
//         {_id: req.params.id},
//         req.body,
//         { new: true, runValidators: true}
//     )
//         .then(updatePirate =>{
//             res.json({results: updatePirate})
//         })
//         .catch(err => {
//             res.json(err)
//         })
// }

// module.exports.deletePirate = (req, res) => {
//     Pirate.deleteOne({_id: req.params.id})
//         .then(pirate =>{
//             res.json({results: pirate})
//         })
//         .catch(err =>{
//             res.json(err)
//         })
// }