const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
    "title":    {type: String, required: true},
    "comments": [ {type: String, required: false}  ]
});

module.exports = mongoose.model("Book", bookSchema);