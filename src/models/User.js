const mongoose = require( "mongoose");
const Subject = require("./Subject")
const userSchema = new mongoose.Schema({

    username: {
        type: String,
        trim: true,
        required: [true, "Please add a user name"],
        maxlength: 32,
        unique: true
    },
    email: {
        type: String,
        trim: true,
        required: [true, "Please add a valid email"],
        maxlength: 100,
        unique: true
       
    },
    password: {
        type: String,
        trim: true,
        required: [true, "Please add a password"],
        minlength: [8, "password must be at least eight(8) characters"]
    },
    role: {
        type: Number,
        default: 0,
    },
    class:{
        type: String,
        default:null,
        trim: true,
        maxlength: 100
    },
    subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject'  }]



} ,{timestamps:true});

module.exports = mongoose.model("User", userSchema)