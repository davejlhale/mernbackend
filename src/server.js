console.log("index.js")
require("./db/connection");

const express=require("express");
const cors = require('cors')
const app = express();
app.use(cors())
const port = process.env.PORT || 5001
app.use(express.json());


//import routes
const userRoutes = require("./routes/userRoutes");
const subjectRoutes = require("./routes/subjectRoutes");

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


