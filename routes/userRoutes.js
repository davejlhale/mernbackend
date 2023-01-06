const express = require("express");
const router = express.Router();
const {signUp,readUsers,updateUser,deleteUser,loginUser} = require("../controllers/userController")

const {hashPass,validatePassword,validateEmail,comparePass,tokenCheck} = require("../src/middleware/validators")


router.post('/signup',validatePassword,validateEmail,hashPass, signUp);
router.post('/findUser',tokenCheck,readUsers);
router.patch('/updateUser',validatePassword,updateUser);
router.delete('/deleteUser',tokenCheck,deleteUser);
router.post('/login',comparePass,loginUser);
router.get("/authCheck", tokenCheck, loginUser) // endpoint for persistant login 
module.exports = router;