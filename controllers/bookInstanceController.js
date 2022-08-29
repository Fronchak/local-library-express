const { nextTick } = require("async");
const BookInstance = require("../models/bookInstance");

exports.bookInstance_list = (req, res, next) => {
    BookInstance
        .find()
        .populate("book")
        .exec(function(err, booksInstances) {
            if(err) return next(err);
            return res.render("booksInstancesList", { title: "Books Copies", booksInstances });
        });
};

exports.bookInstance_detail = (req, res) => {
    res.send("Not implemented: BookInstance detail: " + req.params.id);
};

exports.bookInstance_create_get = (req, res) => {
    res.send("Not implemented: BookInstance create get");
};

exports.bookInstance_create_post = (req, res) => {
    res.send("Not implemented: BookInstance create post");
};

exports.bookInstance_delete_get = (req, res) => {
    res.send("Not implemented: BookInstance delete get");
};

exports.bookInstance_delete_post = (req, res) => {
    res.send("Not implemented: BookInstance delete post");
};

exports.bookInstance_update_get = (req, res) => {
    res.send("Not implemented: BookInstance update get");
};

exports.bookInstance_update_post = (req, res) => {
    res.send("Not implemented: BookInstance update post");
};