const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({

    subjectname: {
        type: String,
        trim: true,
        required: [true, "Please add a subject name"],
        maxlength: 100

    },
    class: {
        type: String,
        required: [true, "Please add a class name"],
        trim: true,
        maxlength: 100

    }

}, { timestamps: true });
module.exports = mongoose.model("Subject", subjectSchema)