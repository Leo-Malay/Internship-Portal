const express = require("express");
const path = require("path");
const config = require("config");
const bcrypt = require("bcrypt");
const db = require("./db");
const db_method = require("./db_method");
// Defining the app.
const app = express();
const route = express.Router();

// Configuring the paths.
route.get("/favicon", (req, res) => {
    res.sendFile(path.join(__dirname + "/public/IMG/favicon.ico"));
});
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
    res.sendFile(path.join(__dirname + "/public/Register.html"));
});
route.get("/cdashboard", (req, res) => {
    res.sendFile(path.join(__dirname + "/public/c_dashboard.html"));
});
route.get("/sdashboard", (req, res) => {
    res.sendFile(path.join(__dirname + "/public/s_dashboard.html"));
});
route.post("/register", (req, res) => {
    var query = {
        fname: req.body.fname,
        lname: req.body.lname,
        enrollment: req.body.enrollment,
        mobile: req.body.mobile,
        institute: req.body.institute,
        branch: req.body.branch,
        sem: req.body.sem,
        cgpa: req.body.cgpa,
        password: req.body.password,
        isDeleted: 0,
        createDate: Date.now(),
        token: "",
    };
    console.log(query);
    if (query.password !== req.body.cpassword) {
        res.redirect("/register?error=3");
    } else if (
        query.fname &&
        query.lname &&
        query.enrollment &&
        query.mobile &&
        query.institute &&
        query.branch &&
        query.sem &&
        query.cgpa &&
        query.password
    ) {
        db_method
            .Find(config.get("DB.name.student_user"), {
                enrollment: query.enrollment,
                isDeleted: 0,
            })
            .then((result0) => {
                if (result0) {
                    res.redirect("/register?error=4");
                } else {
                    bcrypt.hash(
                        query.password,
                        config.get("AUTH.BCRYPT.saltRound"),
                        (err, pass_hash) => {
                            if (err) throw err;
                            query.password = pass_hash;
                            db_method
                                .Insert(
                                    config.get("DB.name.student_user"),
                                    query
                                )
                                .then((result1) => {
                                    console.log(result1);
                                    if (result1.insertedId) {
                                        res.redirect("/login?type=student");
                                    } else {
                                        res.redirect("/register?error=1");
                                    }
                                });
                        }
                    );
                }
            });
    } else {
        res.redirect("/register?error=2");
    }
});
route.post("/login", (req, res) => {
    var query = {
        type: req.body.type,
        enrollment: req.body.enrollment,
        password: req.body.password,
    };
    if (query.type && query.enrollment && query.password) {
        if (query.type == "company") {
            db_method
                .Find(config.get("DB.name.company_user"), {
                    enrollment: query.enrollment,
                    isDeleted: 0,
                })
                .then((result0) => {
                    if (result0 === null) {
                        res.redirect(
                            "/login?type=company&error=1&msg=Unable to find your account"
                        );
                    } else {
                        bcrypt.compare(
                            payload.password,
                            result0.password,
                            function (err, result1) {
                                if (err) throw err;
                                if (result1 === true) {
                                    var token = GenToken(
                                        {
                                            uid: db.getID(result0._id),
                                            enrollment: result0.enrollment,
                                            isDeleted: 0,
                                        },
                                        1
                                    );
                                    db_method
                                        .Update(
                                            config.get("DB.name.company_user"),
                                            {
                                                enrollment: query.enrollment,
                                                isDeleted: 0,
                                            },
                                            { token: token }
                                        )
                                        .then((result1) => {
                                            if (
                                                result1.lastErrorObject
                                                    .updatedExisting === true
                                            ) {
                                                res.redirect(
                                                    "/cdashboard?name=" +
                                                        result0.fname +
                                                        "&token=" +
                                                        token
                                                );
                                            } else {
                                                res.redirect(
                                                    "/login?type=company&error=1&msg=Unable to Generate Token"
                                                );
                                            }
                                        });
                                } else {
                                    res.redirect(
                                        "/login?type=company&error=1&msg=Incorrect Password"
                                    );
                                }
                            }
                        );
                    }
                });
        } else {
            db_method
                .Find(config.get("DB.name.student_user"), {
                    enrollment: query.enrollment,
                    isDeleted: 0,
                })
                .then((result0) => {
                    if (result0 === null) {
                        res.redirect(
                            "/login?type=student&error=1&msg=Unable to find your account"
                        );
                    } else {
                        bcrypt.compare(
                            payload.password,
                            result0.password,
                            function (err, result1) {
                                if (err) throw err;
                                if (result1 === true) {
                                    var token = GenToken(
                                        {
                                            uid: db.getID(result0._id),
                                            enrollment: result0.enrollment,
                                            isDeleted: 0,
                                        },
                                        1
                                    );
                                    db_method
                                        .Update(
                                            config.get("DB.name.student_user"),
                                            {
                                                enrollment: query.enrollment,
                                                isDeleted: 0,
                                            },
                                            { token: token }
                                        )
                                        .then((result1) => {
                                            if (
                                                result1.lastErrorObject
                                                    .updatedExisting === true
                                            ) {
                                                res.redirect(
                                                    "/sdashboard?name=" +
                                                        result0.fname +
                                                        "&token=" +
                                                        token
                                                );
                                            } else {
                                                res.redirect(
                                                    "/login?type=student&error=1&msg=Unable to Generate Token"
                                                );
                                            }
                                        });
                                } else {
                                    res.redirect(
                                        "/login?type=student&error=1&msg=Incorrect Password"
                                    );
                                }
                            }
                        );
                    }
                });
        }
    } else {
        res.redirect("/login?type=student&error=1&msg=Missing Feilds");
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
db.connect((err) => {
    if (err) throw err;
    app.listen(process.env.PORT || 8501, () => {
        console.log("[+] Server has started", process.env.PORT || 8501);
    });
});
