// Require mongoose and save reference to the Schema constructor
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create a note "schema object" using the Schema constructor
const NoteSchema = new Schema({
    content: {
        type: String,
        required: true
    }
});

// create a mongoose note "model" and export it
const Note = mongoose.model("Note", NoteSchema);
module.exports = Note;