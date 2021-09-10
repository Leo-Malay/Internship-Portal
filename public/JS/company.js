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
