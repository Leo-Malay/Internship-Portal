const express = require("express");
const path = require("path");

// Defining the app.
const app = express();
const route = express.Router();

// Configuring the paths.
route.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/public/Home.html"));
});
route.get("/contactus", (req, res) => {
    res.sendFile(path.join(__dirname + "/public/ContactUs.html"));
});
route.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname + "/public/Login.html"));
});
route.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname + "/public/register.html"));
});
route.get("/cdashboard", (req, res) => {
    res.sendFile(path.join(__dirname + "/public/c_dashboard.html"));
});
route.get("/sdashboard", (req, res) => {
    res.sendFile(path.join(__dirname + "/public/s_dashboard.html"));
});
route.post("/login", (req, res) => {
    var query = {
        type: req.body.type,
        username: req.body.username,
        password: req.body.password,
    };
    if (query.type && query.username && query.password) {
        if (query.type == "company") {
            res.redirect("/cdashboard?name=" + query.username);
        } else {
            res.redirect("/sdashboard?name=" + query.username);
        }
    } else {
        res.json({ success: false, msg: "Missing Feilds" });
    }
});
route.post("/add_internship", (req, res) => {
    var query = {};
    if (query) {
        res.json({ success: true });
    } else {
        res.json({ success: false, msg: "Missing Feilds" });
    }
});
route.post("/report", (req, res) => {
    var query = { details: req.body.details, isResolved: 0, isDeleted: 0 };
    if (query) {
        res.json({ success: true });
    } else {
        res.json({ success: false, msg: "Missing Feilds" });
    }
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
