const Book = require("../models/book");
const Author = require("../models/author");
const Genre = require("../models/genre");
const BookInstance = require("../models/bookInstance");
const async = require("async");

exports.index = (req, res) => {
    async.parallel({
        bookCount(callback) {
            Book.countDocuments({}, callback);
        },
        bookInstanceCount(callback) {
            BookInstance.countDocuments({}, callback);
        },
        bookInstanceAvailableCount(callback) {
            BookInstance.countDocuments({ status: "Available" }, callback);
        },
        authorCount(callback) {
            Author.countDocuments({}, callback);
        },
        genreCount(callback) {
            Genre.countDocuments({}, callback);
        }
    },
    (err, results) => {
        console.log(err);
        res.render("index", { 
            title: "Local Library Home",
            error: err,
            data: results
        });
    });
};

exports.book_list = (req, res, next) => {
    Book.find({}, "title author")
        .sort({title: 1})
        .populate("author")
        .exec(function(err, books) {
            console.log(books);
            if (err) return next(err);
            res.render("booksList", { title: "Book List", books });
        });
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