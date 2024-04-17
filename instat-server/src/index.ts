import express from "express";
import cors from "cors";
const app = express();

app.use(express.json()).use(cors());


require('../src/routes/getAllFlux.js')(app)

app.listen(5000, ()=> {
    console.log("server is running on localhost:5000")
})