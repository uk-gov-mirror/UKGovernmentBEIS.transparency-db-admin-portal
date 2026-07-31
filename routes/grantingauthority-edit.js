// ********************************************************************
// Gov.UK transparency Subsidy granting authority edit module
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

    // req.query = JSON.parse(JSON.stringify(req.query));
    if (req.query.hasOwnProperty("edit")) {
      const grantingAuthorityID = req.query.edit;
      ssn.grantingAuthorityName_Error = "";
      console.log("ssn.grantingAuthorityID_Global", grantingAuthorityID);
      console.log(
        "ssn.grantingAuthorityName_Global",
        ssn.grantingAuthorityName_Global
      );

      res.render("bulkupload/grantingauthority-edit", {
        ssn,
        // ssn.grantingAuthorityID_Global,
        // ssn.grantingAuthorityName_Global,
      });
    }
  }
});

module.exports = router;
