const express = require("express");
const path = require("path");

// Defining the app.
const app = express();
const route = express.Router();

// Configuring the paths.
route.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/public/Home.html"));
});
route.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname + "/public/Login.html"));
});
route.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname + "/public/register.html"));
});

// Configuring the apps.
app.use(express.static("public"));
app.use(express.urlencoded({ extended: !0 }));
app.use(express.json());
app.use("/", route);
// listening at port 8080
app.listen(8080, () => {
    console.log("Listening at port 8080");
});
