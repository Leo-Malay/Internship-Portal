/* Malay Bhavsar (Leo-Malay) */
const express = require("express");
const path = require("path");
const config = require("config");
const bcrypt = require("bcrypt");
const url = require("url");
const cookieParser = require("cookie-parser");
const sessions = require("express-session");
const db = require("./db");
const db_method = require("./db_method");
const { GenToken, VerifyToken } = require("./token");
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
    var session = req.session;
    if (session?.data) {
        if (session.data.type == "company" && req.query.type == "company") {
            res.redirect(
                url.format({
                    pathname: "/cdashboard",
                    query: {
                        name: session.data.fname,
                    },
                })
            );
        } else if (
            session.data.type == "student" &&
            req.query.type == "student"
        ) {
            res.redirect(
                url.format({
                    pathname: "/sdashboard",
                    query: {
                        name: session.data.fname,
                    },
                })
            );
        } else {
            req.session.destroy();
            res.redirect("back");
        }
    } else {
        res.sendFile(path.join(__dirname + "/public/Login.html"));
    }
});
route.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname + "/public/Register.html"));
});
route.get("/cdashboard", (req, res) => {
    var session = req.session;
    if (session?.data && session?.data.type == "company") {
        res.sendFile(path.join(__dirname + "/public/c_dashboard.html"), {
            name: session.fname,
        });
    } else {
        res.redirect(
            url.format({
                pathname: "/login",
                query: {
                    type: "company",
                },
            })
        );
    }
});
route.get("/sdashboard", (req, res) => {
    var session = req.session;
    if (session?.data && session?.data.type == "student") {
        res.sendFile(path.join(__dirname + "/public/s_dashboard.html"), {
            name: session.fname,
        });
    } else {
        res.redirect(
            url.format({
                pathname: "/login",
                query: {
                    type: "student",
                },
            })
        );
    }
});
// Login and Registration
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
        token: null,
        application: [],
    };
    if (query.password !== req.body.cpassword) {
        res.redirect(
            url.format({
                pathname: "/register",
                query: {
                    error: 3,
                },
            })
        );
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
                    res.redirect(
                        url.format({
                            pathname: "/register",
                            query: {
                                error: 4,
                            },
                        })
                    );
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
                                    if (result1.insertedId) {
                                        res.redirect(
                                            url.format({
                                                pathname: "/login",
                                                query: {
                                                    type: "student",
                                                },
                                            })
                                        );
                                    } else {
                                        res.redirect(
                                            url.format({
                                                pathname: "/register",
                                                query: {
                                                    error: 1,
                                                },
                                            })
                                        );
                                    }
                                });
                        }
                    );
                }
            });
    } else {
        res.redirect(
            url.format({
                pathname: "/register",
                query: {
                    error: 2,
                },
            })
        );
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
                            url.format({
                                pathname: "/login",
                                query: {
                                    type: "company",
                                    error: 1,
                                    msg: "Unable to find your account",
                                },
                            })
                        );
                    } else {
                        bcrypt.compare(
                            query.password,
                            result0.password,
                            function (err, result1) {
                                if (err) throw err;
                                if (result1 === true) {
                                    var token = GenToken(
                                        {
                                            uid: db.getOID(result0._id),
                                            enrollment: result0.enrollment,
                                            fname: result0.fname,
                                            type: "company",
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
                                                var session = req.session;
                                                session.data = {
                                                    createDate: Date.now(),
                                                    type: "company",
                                                    _id: result0._id,
                                                    fname: result0.fname,
                                                    token: token,
                                                };
                                                res.redirect(
                                                    url.format({
                                                        pathname: "/cdashboard",
                                                        query: {
                                                            name: result0.fname,
                                                        },
                                                    })
                                                );
                                            } else {
                                                res.redirect(
                                                    url.format({
                                                        pathname: "/login",
                                                        query: {
                                                            type: "company",
                                                            error: 1,
                                                            msg: "Unable to generate token",
                                                        },
                                                    })
                                                );
                                            }
                                        });
                                } else {
                                    res.redirect(
                                        url.format({
                                            pathname: "/login",
                                            query: {
                                                type: "company",
                                                error: 1,
                                                msg: "Incorrect Password",
                                            },
                                        })
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
                            url.format({
                                pathname: "/login",
                                query: {
                                    type: "student",
                                    error: 1,
                                    msg: "Unable to find your account",
                                },
                            })
                        );
                    } else {
                        bcrypt.compare(
                            query.password,
                            result0.password,
                            function (err, result1) {
                                if (err) throw err;
                                if (result1 === true) {
                                    var token = GenToken(
                                        {
                                            uid: db.getOID(result0._id),
                                            enrollment: result0.enrollment,
                                            fname: result0.fname,
                                            type: "student",
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
                                                var session = req.session;
                                                session.data = {
                                                    createDate: Date.now(),
                                                    type: "student",
                                                    _id: result0._id,
                                                    fname: result0.fname,
                                                };
                                                res.redirect(
                                                    url.format({
                                                        pathname: "/sdashboard",
                                                        query: {
                                                            name: result0.fname,
                                                        },
                                                    })
                                                );
                                            } else {
                                                res.redirect(
                                                    url.format({
                                                        pathname: "/login",
                                                        query: {
                                                            type: "student",
                                                            error: 1,
                                                            msg: "Unable to gen token",
                                                        },
                                                    })
                                                );
                                            }
                                        });
                                } else {
                                    res.redirect(
                                        url.format({
                                            pathname: "/login",
                                            query: {
                                                type: "student",
                                                error: 1,
                                                msg: "Incorrect Password",
                                            },
                                        })
                                    );
                                }
                            }
                        );
                    }
                });
        }
    } else {
        res.redirect(
            url.format({
                pathname: "/login",
                query: {
                    type: "student",
                    error: 1,
                    msg: "Missing Feilds",
                },
            })
        );
    }
});
route.post("/logout", (req, res) => {
    req.session.destroy();
    res.clearCookie("token");
    res.redirect("back");
});
// Company portal
route.post("/add_internship", (req, res) => {
    var session = req.session;
    if (session?.data) {
        var query = {
            title: req.body.title,
            company: req.body.company,
            description: req.body.description,
            duration: req.body.duration,
            stipend: req.body.stipend,
            locations: req.body.locations,
            positions: req.body.positions,
            benefits: req.body.benefits,
            applicants: [],
            createdBy: session.data._id,
            isDeleted: 0,
        };
        if (query) {
            db_method
                .Insert(config.get("DB.name.internship"), query)
                .then((result0) => {
                    if (result0.insertedId) {
                        res.redirect("back");
                    } else {
                        res.redirect(
                            url.format({
                                pathname: "/cdashboard",
                                query: {
                                    error: 1,
                                },
                            })
                        );
                    }
                });
        } else {
            res.json({ success: false, msg: "Missing Feilds" });
        }
    } else {
        res.redirect("/login?type=company");
    }
});
route.get("/internship", (req, res) => {
    db_method
        .FindAll(config.get("DB.name.internship"))
        .toArray((err, result0) => {
            if (err) throw err;
            res.json(result0);
        });
});
route.get("/application_company", (req, res) => {
    var session = req.session;
    if (session?.data) {
        db_method
            .FindAll(config.get("DB.name.internship"), {
                createdBy: session.data._id,
                isDeleted: 0,
            })
            .toArray((err, result0) => {
                if (err) throw err;
                if (result0) {
                    res.json({
                        success: true,
                        data: result0.map((val, index) => {
                            return val.applicants.map((val1, index1) => {
                                return val1.student_id;
                            });
                        }),
                    });
                } else {
                    res.json({ success: false, data: [] });
                }
            });
    } else {
        res.redirect("/login?type=company");
    }
});
route.get("/application_student", (req, res) => {
    db_method
        .Find(config.get("DB.name.student_user"), {
            _id: db.getOID(req.query.student_id),
            isDeleted: 0,
        })
        .then((result1) => {
            res.json({
                success: true,
                data: {
                    enrollment: result1.enrollment,
                    fname: result1.fname,
                    lname: result1.lname,
                    cgpa: result1.cgpa,
                },
            });
        });
});
// Students portal
route.post("/report", (req, res) => {
    var session = req.session;
    if (session?.data) {
        var query = {
            student_id: session.data._id,
            details: req.body.details,
            isResolved: 0,
            isDeleted: 0,
            createDate: Date.now(),
        };
        if (query.details) {
            db_method
                .Insert(config.get("DB.name.report"), query)
                .then((result0) => {
                    if (result0.insertedId) {
                        res.redirect("back");
                    } else {
                        res.json({ success: false, msg: "Missing Feilds" });
                    }
                });
        } else {
            res.json({ success: false, msg: "Missing Feilds" });
        }
    } else {
        res.json({ success: false, msg: "Invalid Token" });
    }
});
route.get("/sdash", (req, res) => {
    var session = req.session;
    if (session?.data) {
        db_method
            .Find(config.get("DB.name.student_user"), {
                _id: db.getOID(session.data._id),
                isDeleted: 0,
            })
            .then((result0) => {
                if (result0) {
                    res.json({ success: true, data: result0 });
                } else {
                    res.json({ success: false, data: [] });
                }
            });
    } else {
        res.redirect("/login");
    }
});
route.post("/apply", (req, res) => {
    var session = req.session;
    if (session?.data) {
        db_method
            .InsertArray(
                config.get("DB.name.student_user"),
                {
                    _id: db.getOID(session.data._id),
                    isDeleted: 0,
                },
                {
                    application: {
                        app_id: req.body.app_id,
                        createDate: Date.now(),
                    },
                }
            )
            .then((result0) => {
                if (result0) {
                    db_method
                        .InsertArray(
                            config.get("DB.name.internship"),
                            {
                                _id: db.getOID(req.body.app_id),
                                isDeleted: 0,
                            },
                            {
                                applicants: {
                                    student_id: String(session.data._id),
                                    createDate: Date.now(),
                                },
                            }
                        )
                        .then((result1) => {
                            if (result1) {
                                res.json({ success: true });
                            } else {
                                res.json({ success: false });
                            }
                        });
                } else {
                    res.json({ success: false });
                }
            });
    } else {
        res.redirect("/login?type=student");
    }
});
route.get("/myapplication", (req, res) => {
    var session = req.session;
    db_method
        .Find(config.get("DB.name.student_user"), {
            _id: db.getOID(session.data._id),
            isDeleted: 0,
        })
        .then((result0) => {
            if (result0) {
                db_method
                    .FindAll(config.get("DB.name.internship"), {
                        _id: {
                            $in: result0.application.map((val, index) => {
                                return db.getOID(val.app_id);
                            }),
                        },
                    })
                    .toArray((err, result1) => {
                        if (err) throw err;
                        res.json({ success: true, data: result1 });
                    });
            } else {
                res.json({ success: false, data: [] });
            }
        });
});
// Configuring the apps.
app.use(express.static("public"));
app.use(express.urlencoded({ extended: !0 }));
app.use(express.json());
app.use(cookieParser());
const oneHour = 1000 * 60 * 60;
app.use(
    sessions({
        secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
        saveUninitialized: true,
        cookie: { maxAge: oneHour },
        resave: false,
    })
);
app.use("/", route);
// listening at port 8080
db.connect((err) => {
    if (err) throw err;
    app.listen(process.env.PORT || 8501, () => {
        console.log("[+] Server has started", process.env.PORT || 8501);
    });
});
