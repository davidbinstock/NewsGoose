
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
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsgoose";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// ==============================================================================================================
// ROUTES
// ==============================================================================================================
module.exports = function(app){
    
    // ---------------------------------------
    // Default home route
    // ---------------------------------------
    app.get("/", function(req, res){
        res.render("index")
    })
    
    // ---------------------------------------
    // GET route for scraping
    // ---------------------------------------
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
                result.imageLink = $(this)
                    .children("div.item__content").children("figure").children("a").children(".img-wrapper").children("picture").children("source")
                    .attr("data-srcset");
                result.snippet = $(this)
                    .children("div.item__content").children("div.excerpt").children("p")
                    .text();

                // console.log(result);

                // May want to update this call - concern is that now if it finds the id, it will just re-write the data instead of ignoring it...
                db.Article.findOneAndUpdate(
                    {articleId: result.articleId},
                    result,
                    {
                        upsert: true,
                        setDefaultsOnInsert: true
                    }
                )
                // db.Article.create(result)
                    .then(dbArticle => console.log(dbArticle))
                    .catch(error =>console.log(error))
            });

            res.send("Scraping is complete")
        })
    });

    // ---------------------------------------
    // get list of articles
    // ---------------------------------------
    app.get("/articles", function(req,res){
        db.Article.find({})
        .then(dbResults => {
            const viewObject = {
                articles: dbResults
            }
            res.render("articles", viewObject)
        })
    });
    // ---------------------------------------
    // get list of saved articles
    // ---------------------------------------
    app.get("/saved", function(req,res){
        db.Article.find({saved:true})
        .then(dbResults => {
            const viewObject = {
                articles: dbResults
            }
            res.render("articles", viewObject)
        })
    });

    
    // ---------------------------------------
    // put - save article
    // ---------------------------------------
    app.put("/articles/:action/:id", function(req,res){
        let updateObj = {}; 
        switch(req.params.action){
            case "save":
                updateObj = { $set: {saved : true}};
                break;
            case "unsave":
                updateObj = { $set: {saved : false}}
                break;
        }
        
        db.Article.findOneAndUpdate(
            { _id: req.params.id},
            updateObj,
            { new: true}
        )
            .then(dbArticle => {
                console.log(dbArticle);
                res.json(dbArticle);
            })
            .catch(error => {
                console.log(error);
                res.send(dbArticle);
            })
    });

    // ---------------------------------------
    // get specific article and retrieve notes
    // ---------------------------------------
    app.get("/seenotes/:id", function(req,res){
        db.Article.findOne({_id:req.params.id})
        .populate("notes")
        .then(dbResult => {
            const viewObject = {article: dbResult};
            console.log(viewObject);
            res.render("notepage", viewObject)
        })
    });


    // ---------------------------------------
    // post for savings notes
    // ---------------------------------------
    app.get("/savenote", function(req,res){
        console.log(req.body)
        // db.Note.create(
        //     {articleId: result.articleId},
        //     result,
        //     {
        //         upsert: true,
        //         setDefaultsOnInsert: true
        //     }
        // )
        // // db.Article.create(result)
        //     .then(dbArticle => console.log(dbArticle))
        //     .catch(error =>console.log(error))
    });

}
