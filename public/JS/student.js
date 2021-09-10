function display_internship() {
    res = "";
    $.get("/internship", function (data, status) {
        if (status == "success") {
            data.map((ele) => {
                res +=
                    '<div class="post"><div class="left"><p id="heading">' +
                    ele.title +
                    '</p><p id="desc">' +
                    ele.description +
                    '</p><table id="body"><tr><td><b>Company</b></td><td>' +
                    ele.company +
                    "</td></tr><tr><td><b>Duration</b></td><td>" +
                    ele.duration +
                    " Months</td></tr><tr><td><b>Stipend</b></td><td>$" +
                    ele.stipend +
                    "/month</td></tr><tr><td><b>Location</b> </td> <td>" +
                    ele.locations +
                    "</td></tr><tr><td><b>Positions</b></td><td>" +
                    ele.positions +
                    "</td></tr><tr><td><b>Benefits</b></td><td>" +
                    ele.benefits +
                    '</td> </tr></table></div><div class="right"><input type="button"value="Contact Us"id="primary"/><br /><input type="button"value="Apply Now"id="primary" onclick="apply_to_internship(' +
                    "'" +
                    ele._id +
                    "'" +
                    ')"/><br /><input type="button" value="Save" id="primary" /></div></div>';
            });
        }
        document.getElementById("internship_post").innerHTML = res;
    });
}
function display_profile() {
    var res = "";
    $.get("/sdash", function (data, status) {
        if (status == "success") {
            document.getElementById("in_fname").value = data.data.fname;
            document.getElementById("in_lname").value = data.data.lname;
            document.getElementById("in_enrollment").value =
                data.data.enrollment;
            document.getElementById("in_mobile").value = data.data.mobile;
            document.getElementById("in_institute").value = data.data.institute;
            document.getElementById("in_branch").value = data.data.branch;
            document.getElementById("in_sem").value = data.data.sem;
            document.getElementById("in_cgpa").value = data.data.cgpa;
        }
    });
}
function display_application() {
    res = "";
    $.get("/myapplication", function (data, status) {
        console.log(data);
        if (status == "success") {
            data.data.map((ele) => {
                res +=
                    '<div class="post"><div class="left"><p id="heading">' +
                    ele.title +
                    '</p><p id="desc">' +
                    ele.description +
                    '</p><table id="body"><tr><td><b>Company</b></td><td>' +
                    ele.company +
                    "</td></tr><tr><td><b>Duration</b></td><td>" +
                    ele.duration +
                    " Months</td></tr><tr><td><b>Stipend</b></td><td>$" +
                    ele.stipend +
                    "/month</td></tr><tr><td><b>Location</b> </td> <td>" +
                    ele.locations +
                    "</td></tr><tr><td><b>Positions</b></td><td>" +
                    ele.positions +
                    "</td></tr><tr><td><b>Benefits</b></td><td>" +
                    ele.benefits +
                    '</td> </tr></table></div><div class="right"><input type="button"value="Contact"id="primary"/><input type="button"value="Status: In Review"id="primary"/><br /><input type="button"value="Withdraw"id="false" onclick="withdraw_from_internship(' +
                    "'" +
                    ele._id +
                    "'" +
                    ')"/></div></div>';
            });
        }
        document.getElementById("app_post").innerHTML = res;
    });
}

function apply_to_internship(_id) {
    $.post(
        "/apply",
        {
            app_id: _id,
        },
        function (data, status) {
            if (status == "success" && data.success == true) {
                alert("Application Successful");
            } else {
                alert("Application Unsuccessful");
            }
        }
    );
}
function withdraw_from_internship(_id) {
    alert("Under Construction ;)");
}

function profile_update() {
    var btn = document.getElementById("update_btn");
    if (btn.value == "Edit") {
        btn.value = "Update";
        btn.style.backgroundColor = "mediumseagreen";
        document.getElementById("in_fname").disabled = false;
        document.getElementById("in_lname").disabled = false;
        document.getElementById("in_mobile").disabled = false;
        document.getElementById("in_institute").disabled = false;
        document.getElementById("in_branch").disabled = false;
        document.getElementById("in_sem").disabled = false;
        document.getElementById("in_cgpa").disabled = false;
    } else {
        btn.value = "Edit";
        btn.style.backgroundColor = "dodgerblue";
        document.getElementById("in_fname").disabled = true;
        document.getElementById("in_lname").disabled = true;
        document.getElementById("in_mobile").disabled = true;
        document.getElementById("in_institute").disabled = true;
        document.getElementById("in_branch").disabled = true;
        document.getElementById("in_sem").disabled = true;
        document.getElementById("in_cgpa").disabled = true;
    }
}
