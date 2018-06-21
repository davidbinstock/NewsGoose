// ==============================================================================================================
// DEPENDENCIES
// ==============================================================================================================
const express = require("express");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const request = require("request");
const cheerio = require("cheerio");

// ==============================================================================================================
// CONFIGURE EXPRESS APP
// ==============================================================================================================
// Initialize app
const app = express();
// Set up port
const PORT = process.env.PORT || 3000;
// Set "public" as static directory
app.use(express.static("public"))

// Set handlebars as the default templating engine.
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Set Up App to Use Body-Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());

// ==============================================================================================================
// ROUTES
// ==============================================================================================================

app.get("/", function(request, response){
    response.send("Hello!!! Welcome to NewsGoose!! So glad you could make it!")
})

// ==============================================================================================================
// START THE SERVER
// ==============================================================================================================
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});
  