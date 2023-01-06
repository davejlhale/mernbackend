const User = require("../../models/User");
const Subject = require("../../models/Subject");
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")

exports.readUsers = async (req, res, next) => {
    try {
console.log("reading users")
        const results = await User.find(req.body).populate('subjects')
        if (!results) {
            throw new Error("User does not exist");
        }
        res.status(200).send({ users: results })
    } catch (error) {
        console.log(error)
        res.status(500).send({ error: error.message })
    }
}

exports.updateUser = async (req, res, next) => {
    try {
        keysToFind = req.body.find;
        // delete keysToFind.changeValuesTo
        changeValuesTo = req.body.changeValuesTo;

        let result = await User.findOne(keysToFind).populate('subjects');

        //if no user found send response
        if (!result) {
            throw new Error("No matching user found to update")
        } else {
            Object.keys(changeValuesTo).forEach(key => {
                console.log(`change the ${key} to ${changeValuesTo[key]}`);
                changeValuesTo[key] ? result[key] = changeValuesTo[key] : null;
            });

            //save the user and respone sent the result
            await result.save()
            //send the user back in response
            res.status(200).send({ msg: result })
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }

}

exports.deleteUser = async (req, res, next) => {
    try {
        const r = await User.deleteOne(req.body)
        console.log(r)
        if (r.deletedCount > 0) {
            res.status(200).send({ message: `A user successfully deleted ` });
        } else {
            res.status(200).send({ message: `The user not found to delete` });
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({ error: error.message })
    }
}
exports.signUp = async (req, res, next) => {
    try {
        console.log("subs", req.body.subjects)
        const { username } = req.body;
        const { email } = req.body;
        const userExists = await User.findOne({ username });
        if (userExists) {
            throw new Error("An account with that user name already exists");
        }
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            throw new Error("An account with that email already exists");
        }
        if (req.body.subjects?.length > 0) {
            req.body.subjects = req.body.subjects.split(" ");
            for (let index = 0; index < req.body.subjects.length; index++) {
                console.log(index)
                //in sub - find subject from array and users class
                const subject = {
                    subjectname: req.body.subjects[index],
                    class: req.body.class
                }
                let result = await Subject.findOne(subject).exec();

                if (result === null || !result._id) {
                    result = await Subject.create(subject);
                }
                let str = result._id.toString();
                req.body.subjects[index] = str.replace('new ObjectId("', "").replace('")', "")
            }
        }
        let user = await User.create(req.body)
        res.status(201).json({
            sucess: true,
            user
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: error.message
        })
    }
}

exports.loginUser = async (req, res) => {
    console.log("middleware passed and controller has been called")
    try {
        //find a user in out database from the username we pass in the request.
        const user = await User.findOne({username: req.body.authUser})

        //generate a jwt token that encodes the users unique id we have stored the object above and the SECRET token we store as an
        //envrioment variable
        const token = await jwt.sign({_id: user._id }, process.env.SECRET_KEY)
        console.log(token)
        //send in the response the username of the user who has logged in and also send the token we generate above
        //so we can store it on the front end for future use
        res.status(200).send({username: user.username, token })
    } catch (error) {
        console.log(error)
        console.log("username not found")
        res.status(500).send({error: error.message})
    }
}