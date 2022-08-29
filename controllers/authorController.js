const { nextTick } = require("async");
const Author = require("../models/author");

exports.author_list = (req, res, next) => {
    Author
        .find()
        .sort([["family_name", "ascending"]])
        .exec(function(err, authors) {
            if(err) return next(err);
            return res.render("authorsList", { title: "Authors", authors});
        });
};

exports.author_detail = (req, res) => {
    res.send(`Not implemented: Author detail: ${req.params.id}`);
};

exports.author_create_get = (req, res) => {
    res.send("Not implemented: Author create get");
};

exports.author_create_post = (req, res) => {
    res.send("Not implemented: Author create post");
};

exports.author_delete_get = (req, res) => {
    res.send("Not implemented: Author delete get");
};

exports.author_delete_post = (req, res) => {
    res.send("Not implemented: Author delete post");
};

exports.author_update_get = (req, res) => {
    res.send("Not implemented: Author update get");
}

exports.author_update_post = (req, res) => {
    res.send("Not implemented: Author update post");
};
