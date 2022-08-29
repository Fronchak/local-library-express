const async = require("async");
const mongoose = require("mongoose");
const Author = require("../models/author");
const Book = require("../models/book");

exports.author_list = (req, res, next) => {
    Author
        .find()
        .sort([["family_name", "ascending"]])
        .exec(function(err, authors) {
            if(err) return next(err);
            return res.render("authorsList", { title: "Authors", authors});
        });
};

exports.author_detail = (req, res, next) => {
    const id = mongoose.Types.ObjectId(req.params.id);
    async.parallel({
        author(callback) {
            Author.findById(id).exec(callback);
        },
        books(callback) {
            Book
                .find({ author: id })
                .sort({ title: 1 })
                .exec(callback);
        }
    },
    (err, results) => {
        if(err) return next(err);
        if(!results.author) {
            const err = new Error("Author not found");
            err.status = 404;
            return next(err);
        }
        return res.render("authorDetail", { 
            title: results.author.name, 
            author: results.author, 
            books: results.books 
        });
    });
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
