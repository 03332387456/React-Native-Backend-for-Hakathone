require("dotenv").config();
const express = require("express");
const cors = require("cors")
const mongoose = require("mongoose");
const courseRoute = require("./routes/courseroute");
const authRoute = require("./routes/authroute")


const App = express();
App.use(cors())
App.use(express.json());

App.use("/courses", courseRoute);
App.use("/Auth", authRoute);


mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        App.listen(process.env.PORT, () => {
            console.log(
                `Database Connected and server is listening http://localhost:${process.env.PORT}`
            );
        });
    })
    .catch((err) => {
        console.log("err", err);
    });