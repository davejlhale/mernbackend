const express = require("express");
const router = express.Router();
const {createSubject,readSubjects,updateSubjects,deleteSubject} = require("../controllers/subjectController")

console.log("subject")

router.post('/addSubjectClass',createSubject);
router.post('/findSubjectClass',readSubjects);
router.patch('/updateSubjectClass',updateSubjects);
router.delete('/deleteSubjectClass',deleteSubject);
module.exports = router;