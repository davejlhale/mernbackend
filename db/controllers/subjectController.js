const Subject = require("../../models/Subject");


exports.readSubjects = async (req, res, next) => {
    try {

        const results = await Subject.find(req.body);
        if (!results) {
            throw new Error("Subject does not exist");
        }
        res.status(200).send({ Subject: results })
    } catch (error) {
        console.log(error)
        res.status(500).send({ error: error.message })
    }
}

exports.updateSubjects = async (req, res, next) => {
    try {
        keysToFind = req.body.find;
        delete keysToFind.changeValuesTo
        changeValuesTo = req.body.changeValuesTo;

        let result = await Subject.findOne(keysToFind);

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

exports.deleteSubject = async (req, res, next) => {
    try {
        const r= await Subject.deleteOne( req.body)
        console.log(r)
        if (r.deletedCount>0) {
        res.status(200).send({ message: `A Subject successfully deleted ` });
        } else {
            res.status(200).send({ message: `The Subject not found to delete` });
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({ error: error.message })
    }
}
exports.createSubject = async (req, res, next) => {
    try {
        if(!req.body.subjectname || !req.body.class) {
            throw new Error ("must supply both the subjectname and class")
        }
        const SubjectExists = await Subject.findOne( req.body );
        if (SubjectExists) {
            throw new Error("This subject for that year already exists");
        }
       
        const subject = await Subject.create(req.body);
        res.status(201).json({
            sucess: true,
            subject
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

