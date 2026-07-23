// ********************************************************************
// Gov.UK transparency Subsidy granting authority add successfully module
// ********************************************************************

const express = require("express");
var session = require("express-session");
const router = express.Router();
const utils = require("../utils");

router.get("/", (req, res) => {
  ssn = req.session;
  if (
    typeof ssn.dashboard_roles_object_id1 === "undefined" ||
    typeof ssn.dashboard_roles_object_id2 === "undefined"
  ) {
    res.redirect("/signout");
  } else {
    utils.setSecurityHeaders(res, beis_url_accessmanagement);
    if (!["BEIS Administrator"].includes(ssn.dashboard_roles)) {
      return res.render("bulkupload/notAuthorized");
    }
    res.render("bulkupload/grantingauthority-addsuccessfully");
  }
});

module.exports = router;
