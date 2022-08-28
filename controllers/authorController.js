const Author = require("../models/author");

exports.author_list = (req, res) => {
    res.send("Not implemented: Author list");
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
