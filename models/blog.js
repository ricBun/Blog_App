var mongoose = require("mongoose");

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type:Date, default: Date.now},
    author: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog_User"
      },
      username: String
    }
});

module.exports = mongoose.model("BlogApp_blog", blogSchema);
