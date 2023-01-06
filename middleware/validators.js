const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");
const User = require("../models/User");
exports.hashPass = async (req, res, next) => {
    try {
        req.body.password = await bcrypt.hash(req.body.password, 10);
        next();
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

/* the validatePassword function below might get called from routes needing different req.body formatting. 
so multiple functions are not needed for each route we need to figure out which req.body was
sent and locate the password that needs validating
    
/ eg --- updateUser
{
  "find":{
    "username":"Dave" 
  },
  "changeValuesTo":{
    "username":"Tom11",
    "password":"Tomps@@1",
    "email":"tom11@tom.com"
  }
}
/eg --- or signup
{
    "username":"Dave",
    "password":"Davepass@1",
    "email":"dave@dave.com"
}

therefor depending on the entry point the password that needs validating resides in a defferent key

*/
exports.validatePassword = async (req, res, next) => {
    try {
        /* if we are requesting update the password to validate comes
         from req.body.changeValuesTo.password */
        if (req.body.changeValuesTo && req.body.changeValuesTo.password) {
            passwordToValidate = req.body.changeValuesTo.password
        }
        /* else we are signing up/creating a new user so
        the password to validate comes from req.body.password */
        else {
            passwordToValidate = req.body.password;
        }
        const reg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,255}$/;
        if (!reg.test(passwordToValidate)) {
            throw new Error("Password must contain at least 1 uppercase letter, 1 lowercase, I special charater and 1 number");
        }
        next();
    }
    catch (error) {
        res.status(500).send({ error: error.message });
    }
}
/* same multiple routes to here as for validatePassword above */
exports.validateEmail = async (req, res, next) => {
    try {
        //find the email to validate from different req.body formatting options
        if (req.body.changeValuesTo && req.body.changeValuesTo.email) {
            emailToValidate = req.body.changeValuesTo.email
        } else {
            emailToValidate = req.body.email;
        }
        const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!reg.test(emailToValidate)) {
            throw new Error("Please enter a valid email");
        }
        next();
    }
    catch (error) {
        res.status(500).send({ error: error.message });
    }
}

exports.comparePass = async (req, res, next) => {
    try {
        
        req.user = await User.findOne({ username: req.body.authUser })
        
        if (req.user && await bcrypt.compare(req.body.password, req.user.password)) {
            console.log("username exists and plain text password matches hashed password")
            next();
        } else {
            return res.status(401).send({ error: "incorrect username or password" })
        }
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
}

exports.tokenCheck = async (req, res, next) => {
    try {
        console.log("token checking")
       
        const token = req.header("Authorization").replace("Bearer ", "");
        
        const decodeToken = await jwt.verify(token, process.env.SECRET_KEY);
        
        const user = await User.findById(decodeToken._id);
       
        if (user) {
            req.body.authUser = user.username
            next();
        } else {
            //return res.status(401).send({msg:"Not authorised"})
            throw new Error("Not authorised")
        }
    } catch (error) {
        res.status(500).send({ error: "Not authorised" });
    }
}
