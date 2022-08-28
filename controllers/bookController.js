const Book = require("../models/book");

exports.index = (req, res) => {
    res.send("Not implemented: Site home page");
};

exports.book_list = (req, res) => {
    res.send("Not implemented: Book list");
};

exports.book_detail = (req, res) => {
    res.send("Not implemented: Book detail " + req.params.id);
};

exports.book_create_get = (req, res) => {
    res.send("Not implemented: Book create get");
};

exports.book_create_post = (req, res) => {
    res.send("Not implemented: Book create post");
};

exports.book_delete_get = (req, res) => {
    res.send("Not implemented: Book delete get");
};

exports.book_delete_post = (req, res) => {
    res.send("Not implementd: Book delete post");
};

exports.book_update_get = (req, res) => {
    res.send("Not implemented: Book update get");
};

exports.book_update_post = (req, res) => {
    res.send("Not implemented: Book update post");
};