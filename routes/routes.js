
// ==============================================================================================================
// DEPENDENCIES
// ==============================================================================================================
const mongoose = require("mongoose");
const request = require("request");
const cheerio = require("cheerio");
const path = require("path");

const db = require("../models")

// ==============================================================================================================
// CONNECT TO MONGO DB VIA MONGOOSE
// ==============================================================================================================
mongoose.connect("mongodb://localhost/newsgoose");

// ==============================================================================================================
// ROUTES
// ==============================================================================================================
module.exports = function(app){
    
    // Default home route
    app.get("/", function(request, response){
        response.send("Hello!!! Welcome to NewsGoose!! So glad you could make it!")
    })
    
    // GET route for scraping
    app.get("/scrape", function(req, res){
        // make request to grab HTML from chosen site
        request("https://www.theonion.com/", function(error, scrapeRes, html){
            // Load the HTML into cheerio
            const $ = cheerio.load(html);
            
            // console.log($("article")[0]);

            // for each article get info and store in database
            $("article").each(function(i, element){
                let result = {}

                result.articleId = $(this)
                    .data("id");
                result.headline = $(this)
                    .children("header").children("h1").children("a")
                    .text();
                result.link = $(this)
                    .children("header").children("h1").children("a")
                    .attr("href");
                // result.imageLink = $(this)
                //     .children("div.item__content").children("figure").children("a").children("div.img-wrapper").children("picture").children("img")
                //     .attr("src");
                result.snippet = $(this)
                    .children("div.item__content").children("div.excerpt").children("p")
                    .text();

                // console.log(result);

                db.Article.create(result)
                    .then(dbArticle => console.log(dbArticle))
                    .catch(error =>console.log(error))
            });

            res.send("Scraping is complete")
        })
    })

}
