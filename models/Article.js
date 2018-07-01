// Require mongoose and save reference to the Schema constructor
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create an article "schema object" using the Schema constructor
const ArticleSchema = new Schema({
    articleId: {
        type: Number,
        required: true
    },
    headline: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    imageLink: {
        type: String
    },
    snippet: {
        type: String
    },
    saved: {
        type: Boolean,
        required: true,
        default: false
    },
    notes: [
        {
          type: Schema.Types.ObjectId,
          ref: "Note"
        }
    ]

});

// create a mongoose article "model" and export it
const Article = mongoose.model("Article", ArticleSchema);
module.exports = Article;