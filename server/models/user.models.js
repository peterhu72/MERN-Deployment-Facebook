const mongoose = require("mongoose");
const bcrypt = require("bcrypt")

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First Name is required"]
    },
    lastName: {
        type: String,
        required: [true, "Last Name is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        validate: {
            validator: val => /^([\w-\.]+@([\w-]+\.)+[\w-]+)?$/.test (val),
            message: 'Please enter a valid Email'
        }
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: [8, 'Password must be at least 8 characters']
    },
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }
    ],
    profilePicture: {
        type: String,
        default: ""
    },
    coverPicture: {
        type: String,
        default: ""
    },
    birthday: {
        type: Date,
        default: "11/11/1111"
    },
    location: {
        type: String,
        default: ""
    },
    friends: [
        {
            type: String
        }
    ]

}, {timestamps: true}) 

UserSchema.virtual('confirm')
    .get(() => this._confirm)
    .set( value => this._confirm = value);

UserSchema.pre('validate', function(next){
    if (this.password !== this.confirm){
        this.invalidate('confirm', 'Password must match confirm password')
    }
    next();
});

UserSchema.pre('save', function(next){
    bcrypt.hash(this.password, 10)
        .then(hash => {
            this.password = hash
            next();
        });
});

module.exports = new mongoose.model('User', UserSchema)
