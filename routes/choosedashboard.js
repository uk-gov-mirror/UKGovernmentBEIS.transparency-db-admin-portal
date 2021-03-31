const express = require("express");
// const jwt_decode = require("jwt-decode");
var session = require("express-session");
const router = express.Router();

const axios = require("axios");
var request = require("request");

router.post("/", async (req, res) => {
  ssn = req.session;
  if (
    typeof ssn.dashboard_roles_object_id1 === "undefined" ||
    typeof ssn.dashboard_roles_object_id2 === "undefined" ||
    req.session.cookie.maxAge <= 0
  ) {
    res.redirect("/signout");
  } else {
    // ********************************************************
    // Read environment property file and set the API URL end points
    // ********************************************************

    Environment_variable = process.argv[2];
    if (Environment_variable == "env=dev") {
      beis_url_publishing =
        "https://dev-beis-tp-db-publishing-subsidies-service.azurewebsites.net";
      beis_url_accessmanagement =
        "https://dev-beis-tp-db-accessmanagement-service-app.azurewebsites.net";
      beis_url_publicsearch =
        "https://dev-beis-tp-db-public-search-service.azurewebsites.net";
      beis_url_searchscheme =
        "https://dev-beis-tp-db-ga-schemes-service.azurewebsites.net";

      console.log(beis_url_publishing);
      console.log(beis_url_accessmanagement);
      console.log(beis_url_publicsearch);
      console.log(beis_url_searchscheme);
    } else if (Environment_variable == "env=integ") {
      beis_url_publishing =
        "https://integ-transparency-db-publishing-subsidies-service.azurewebsites.net";
      beis_url_accessmanagement =
        "https://integ-transparency-db-access-management-service.azurewebsites.net";
      beis_url_publicsearch =
        "https://integ-transparency-db-public-search-service.azurewebsites.net";

      beis_url_searchscheme =
        "https://integ-transparency-db-ga-schemes-service.azurewebsites.net";

      console.log(beis_url_publishing);
      console.log(beis_url_accessmanagement);
      console.log(beis_url_publicsearch);
    } else if (Environment_variable == "env=stag") {
      beis_url_publishing =
        "https://stag-transparency-db-publishing-subsidies-service.azurewebsites.net";
      beis_url_accessmanagement =
        "https://stag-transparency-db-access-management-service.azurewebsites.net";
      beis_url_publicsearch =
        "https://stag-transparency-db-public-search-service.azurewebsites.net";

      beis_url_searchscheme =
        "https://stag-transparency-db-ga-schemes-service.azurewebsites.net";

      console.log(beis_url_publishing);
      console.log(beis_url_accessmanagement);
      console.log(beis_url_publicsearch);
    } else if (Environment_variable == "env=prod") {
      beis_url_publishing =
        "https://prod-transparency-db-publishing-subsidies-service.azurewebsites.net";
      beis_url_accessmanagement =
        "https://prod-transparency-db-access-management-service.azurewebsites.net";
      beis_url_publicsearch =
        "https://prod-transparency-db-public-search-service.azurewebsites.net";
      console.log(beis_url_publishing);
      console.log(beis_url_accessmanagement);
      console.log(beis_url_publicsearch);
    }

    // *******************
    // Globale declarations
    // *******************
    ssn.frontend_totalRecordsPerPage = 10;

    var { dashboard_username, ssn, dashboard_GA } = req.body;

    console.log("dashboard_username:" + dashboard_username);
    console.log("ssn.dashboard_roles:" + ssn.dashboard_roles);

    ssn.dashboard_user_name = dashboard_username;
    ssn.dashboard_ga_name = dashboard_GA;

    // var id_token = req.body.id_token;
    // console.log("id_token "+id_token);
    // var id_token_decoded = jwt_decode(id_token);

    // if(id_token_decoded.roles.includes("4aaddb97-dcb8-4988-b2e5-b045a4419d90")){
    //   ssn.dashboard_roles = "BEIS Administrator";
    // }else if(id_token_decoded.roles.includes("3ee46dda-5f2b-4fd5-b92b-54c2cd8f2930")){
    //   ssn.dashboard_roles = "Granting Authority Administrator";
    // }else if(id_token_decoded.roles.includes("058abc1f-c491-4ffa-bd52-885c4fb96943")){
    //   ssn.dashboard_roles = "Granting Authority Approver";
    // }else if(id_token_decoded.roles.includes("e7f70439-02d4-4367-817e-52283a416ac3")){
    //   ssn.dashboard_roles = "Granting Authority Encoder";
    // }

    if (ssn.dashboard_roles == "BEIS Administrator") {
      const userPrincipleRequest =
        '{"userName": "TEST","password": "password123","role": "BEIS Administrator","grantingAuthorityGroupId": "123","grantingAuthorityGroupName": "test"}';
      var config = {
        headers: {
          userPrinciple: userPrincipleRequest,
        },
      };

      var data = JSON.parse(JSON.stringify(userPrincipleRequest));
      console.log("request :" + JSON.stringify(data));

      try {
        const apidata = await axios.get(
          beis_url_accessmanagement + "/accessmanagement/beisadmin",
          config
        );
        console.log(`Status: ${apidata.status}`);
        API_response_code = `${apidata.status}`;
        console.log("API_response_code: try" + API_response_code);
        console.log("Body: ", apidata.data);
        dashboardawards = apidata.data;

        res.set("X-Frame-Options", "DENY");
        res.set("X-Content-Type-Options", "nosniff");
        res.set("Content-Security-Policy", 'frame-ancestors "self"');
        res.set("Access-Control-Allow-Origin", beis_url_accessmanagement);
        res.set(
          "Strict-Transport-Security",
          "max-age=31536000; includeSubDomains"
        );

        res.render("bulkupload/dashboard-beisadmin", {
          beis_url_accessmanagement,
        });
      } catch (err) {
        response_error_message = err;
        console.log("message error : " + err);
        console.log("response_error_message catch : " + response_error_message);
      }
    } else if (ssn.dashboard_roles == "Granting Authority Administrator") {
      const userPrincipleRequest =
        '{"userName":"SYSTEM","password":"password123","role":"Granting Authority Administrator","grantingAuthorityGroupId":"123","grantingAuthorityGroupName":"' +
        ssn.dashboard_ga_name +
        '"}';
      var config = {
        headers: {
          userPrinciple: userPrincipleRequest,
        },
      };

      var data = JSON.parse(JSON.stringify(userPrincipleRequest));
      console.log("request :" + JSON.stringify(data));

      try {
        const apidata = await axios.get(
          beis_url_accessmanagement + "/accessmanagement/gaadmin",
          config
        );
        console.log(`Status: ${apidata.status}`);
        API_response_code = `${apidata.status}`;
        console.log("API_response_code: try" + API_response_code);
        console.log("Body: ", apidata.data);
        dashboardawards = apidata.data;

        res.set("X-Frame-Options", "DENY");
        res.set("X-Content-Type-Options", "nosniff");
        res.set("Content-Security-Policy", 'frame-ancestors "self"');
        res.set("Access-Control-Allow-Origin", beis_url_accessmanagement);
        res.set(
          "Strict-Transport-Security",
          "max-age=31536000; includeSubDomains"
        );

        res.render("bulkupload/dashboard-gaadmin");
      } catch (err) {
        response_error_message = err;
        console.log("message error : " + err);
        console.log("response_error_message catch : " + response_error_message);
      }
    } else if (ssn.dashboard_roles == "Granting Authority Approver") {
      const userPrincipleRequest =
        '{"userName":"SYSTEM","password":"password123","role":"Granting Authority Approver","grantingAuthorityGroupId":"123","grantingAuthorityGroupName":"' +
        ssn.dashboard_ga_name +
        '"}';
      var config = {
        headers: {
          userPrinciple: userPrincipleRequest,
        },
      };

      var data = JSON.parse(JSON.stringify(userPrincipleRequest));
      console.log("request :" + JSON.stringify(data));

      try {
        const apidata = await axios.get(
          beis_url_accessmanagement + "/accessmanagement/gaapprover",
          config
        );
        console.log(`Status: ${apidata.status}`);
        API_response_code = `${apidata.status}`;
        console.log("API_response_code: try" + API_response_code);
        console.log("Body: ", apidata.data);
        dashboardawards = apidata.data;

        res.set("X-Frame-Options", "DENY");
        res.set("X-Content-Type-Options", "nosniff");
        res.set("Content-Security-Policy", 'frame-ancestors "self"');
        res.set("Access-Control-Allow-Origin", beis_url_accessmanagement);
        res.set(
          "Strict-Transport-Security",
          "max-age=31536000; includeSubDomains"
        );

        res.render("bulkupload/dashboard-gaapprover");
      } catch (err) {
        response_error_message = err;
        console.log("message error : " + err);
        console.log("response_error_message catch : " + response_error_message);
      }
    } else if (ssn.dashboard_roles == "Granting Authority Encoder") {
      const userPrincipleRequest =
        '{"userName":"SYSTEM","password":"password123","role":"Granting Authority Encoder","grantingAuthorityGroupId":"123","grantingAuthorityGroupName":"' +
        ssn.dashboard_ga_name +
        '"}';
      var config = {
        headers: {
          userPrinciple: userPrincipleRequest,
        },
      };

      var data = JSON.parse(JSON.stringify(userPrincipleRequest));
      console.log("request :" + JSON.stringify(data));

      try {
        const apidata = await axios.get(
          beis_url_accessmanagement + "/accessmanagement/gaencoder",
          config
        );
        console.log(`Status: ${apidata.status}`);
        API_response_code = `${apidata.status}`;
        console.log("API_response_code: try" + API_response_code);
        console.log("Body: ", apidata.data);
        dashboardawards = apidata.data;

        res.set("X-Frame-Options", "DENY");
        res.set("X-Content-Type-Options", "nosniff");
        res.set("Content-Security-Policy", 'frame-ancestors "self"');
        res.set("Access-Control-Allow-Origin", beis_url_accessmanagement);
        res.set(
          "Strict-Transport-Security",
          "max-age=31536000; includeSubDomains"
        );

        res.render("bulkupload/dashboard-gaencoder");
      } catch (err) {
        response_error_message = err;
        console.log("message error : " + err);
        console.log("response_error_message catch : " + response_error_message);
      }
    }
  }
});

module.exports = router;
