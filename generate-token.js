// ==============================HEADER===================================

var express = require("express");

var app = express();

var jwt = require("jwt-simple");

var url = require("url");

var secret = ""; //initialize this as a global token so it is accessible for login and logout destroy token.

const urlRedirect = "https://klym-dev.sisense.com";

// ==============================LOG IN======================================

var i = 0; //This is just a variable that will be used to create a unique session ID for jti. Can place any kind of code that will create a unique ID.

//Function generates the payload for the token
function redirectToJwt(request, response, user) {
  var payload;
  var jti = "cdgvdea" + i;
  i++;
  var header = {
    typ: "JWT",
    alg: "HS256",
  };

  var payload = {
    iat: Math.floor(new Date().getTime() / 1000),

    //iat: 10000,
    sub: "viewer.user.0@klym.com",
    firstName: "viewer.user.0",
    // lastName: "Doe",

    // groups: ["TestGroup"],

    jti: jti,

    // token will expire in 3 hours from now

    exp: Math.floor((new Date().getTime() + 180 * 60000) / 1000),
    //domain: "@sisense.com"
  };

  // encode token with payload
  var token = jwt.encode(payload, secret, (algorithm = "HS256"));

  var redirect = urlRedirect + "/jwt?jwt=" + token; //where ip or
  //site name should be placed here
  var query = url.parse(request.url, true).query;
  const returnTo = "/app/main/dashboards/6501cf0b1658c8003274f77c?embed=true";
  if (query["return_to"]) {
    redirect += "&return_to=" + encodeURIComponent(returnTo);
  }
  //   https://klym-dev.sisense.com/app/main/dashboards/6501cf0b1658c8003274f77c?embed=true
  console.log("redirect: ***** ", redirect);

  //   response.end();
  response.writeHead(302, {
    Location: redirect,
  });

  response.end();
}

app.get("/login", function (request, response) {
  console.log("request");
  var query = url.parse(request.url, true).query;
  redirectToJwt(request, response);
});

// ==============================LOG OUT======================================

app.get("/logout", function (request, response) {
  console.log("Logout");

  //Insert a token destroy function here

  response.writeHead(302, {
    Location: "http://www.sisense.com",
  });

  response.end();
});

app.listen(7000); //Example of a port which Sisense will connect to access SSO Handler.

console.log("ready");
