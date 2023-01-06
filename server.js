console.log("index.js")
require("./src/db/connection");

const express=require("express");
const cors = require('cors')
const app = express();
app.use(cors())
const port = process.env.PORT || 5001
app.use(express.json());


//import routes
const userRoutes = require("./src/routes/userRoutes");
const subjectRoutes = require("./src/routes/subjectRoutes");

//routes middleware
app.use("/api",userRoutes)

//deploy healthcheck endpoint
app.get("/health",(req,res)=> {
    res.status(200).send({message:"api is working"});
})

app.use("/api",subjectRoutes)
app.listen(port ,() => {
    console.log(`Listening on port ${port}`);
})


