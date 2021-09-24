/* Malay Bhavsar (Leo-Malay) */
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
                    '</td> </tr></table></div><div class="right"><input type="button"value="Edit"id="primary"/><br /><input type="button"value="Remove"id="false"/></div></div>';
            });
        }
        document.getElementById("internship_post").innerHTML = res;
    });
}
function display_applicants() {
    var res = "";
    document.getElementById("review_post").innerHTML = res;
    $.get("/application_company", function (data, status) {
        if (status == "success" && data.success == true) {
            data.data.map((ele) => {
                ele.map((s_id) => {
                    $.get(
                        "/application_student",
                        { student_id: s_id },
                        function (data1, status) {
                            if (status == "success" && data1.success == true) {
                                res =
                                    '<div class="post"><div class="left"><table id="body">' +
                                    "<tr><td><b>Enrollment No.</td><td>" +
                                    data1.data.enrollment +
                                    "</td></tr><td><b>First Name</b></td><td>" +
                                    data1.data.fname +
                                    "</td></tr><td><b>Last Name</b></td><td>" +
                                    data1.data.lname +
                                    "</td></tr><td><b>CGPA</b></td><td>" +
                                    data1.data.cgpa +
                                    '</td></tr></table></div><div class="right"><input type="button"value="View Student"id="primary"/><br /><input type="button"value="Reject"id="false"/><br /><input type="button" value="Proceed" id="true" /></div></div>';
                            }
                            document.getElementById("review_post").innerHTML +=
                                res;
                        }
                    );
                });
            });
        }
    });
}
