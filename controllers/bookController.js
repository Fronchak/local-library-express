const async = require("async");
const mongoose = require("mongoose");
const Book = require("../models/book");
const Author = require("../models/author");
const Genre = require("../models/genre");
const BookInstance = require("../models/bookInstance");

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
            if (err) return next(err);
            res.render("booksList", { title: "Book List", books });
        });
};

exports.book_detail = (req, res, next) => {
    const id = mongoose.Types.ObjectId(req.params.id);
    async.parallel({
        book(callback) {
            Book.findById(id)
                .populate("author")
                .populate("genre")
                .exec(callback);
        },
        copies(callback) {
            BookInstance.find({ book: id }).exec(callback);
        }
    },
    (err, results) => {
        if(err) return next(err);
        if(!results.book) {
            const err = new Error("Book not found");
            err.status = 404;
            return next(err);
        }
        return res.render("bookDetail", { title: results.book.title, book: results.book, copies: results.copies });
    });
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