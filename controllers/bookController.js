const async = require("async");
const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator"); 
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

exports.book_create_get = (req, res, next) => {
    async.parallel({
        authors(callback) {
            Author.find(callback);
        },
        genres(callback) {
            Genre.find(callback);
        }
    }, 
    (err, results) => {
        if (err) return next(err);
        res.render("bookForm", {
            title: "Create Book",
            authors: results.authors,
            genres: results.genres
        });
    });
};

exports.book_create_post = [
    (req, res, next) => {
        if (!Array.isArray(req.body.genre)) {
            req.body.genre = typeof(req.body.genre) === "undefined" ? [] : [req.body.genre];
        }
        next();
    },
    body("title", "Title must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("author", "Author must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("summary", "Summary must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("isbn", "ISBN must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("genre.*")
        .escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        console.log(errors.array());
        const book = new Book(req.body);
        if (!errors.isEmpty()) {
            async.parallel({
                authors(callback) {
                    Author.find(callback);
                },
                genres(callback) {
                    Genre.find(callback);
                }
            },
            (err, results) => {
                if (err) return next(err);

                for(const genre of results.genres) {
                    if (book.genre.includes(genre._id)) {
                        genre.checked = true;
                    }
                }

                return res.render("bookForm", {
                    title: "Create Book",
                    authors: results.authors,
                    genres: results.genres,
                    book
                });
            });
            return;
        }
        book.save((err) => {
            if (err) return next(err);
            return res.redirect(book.url);
        });
    }
];

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