const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");
const BookInstance = require("../models/bookInstance");
const Book = require("../models/book");

exports.bookInstance_list = (req, res, next) => {
    BookInstance
        .find()
        .populate("book")
        .exec(function(err, booksInstances) {
            if(err) return next(err);
            return res.render("booksInstancesList", { title: "Books Copies", booksInstances });
        });
};

exports.bookInstance_detail = (req, res, next) => {
    const id = mongoose.Types.ObjectId(req.params.id);
    BookInstance.findById(id)
        .populate("book")
        .exec((err, copie) => {
            if (err) return next(err);
            if (!copie) {
                const err = new Error("Cound find book's copie");
                err.status = 404;
                return next(err);
            }
            return res.render("bookInstanceDetail", {title: `Copy: ${copie.book.title}`, copie });
        });   
            
};

exports.bookInstance_create_get = (req, res) => {
    Book.find({}, "title").exec((err, books) => {
        if (err) return next(err);
        res.render("bookInstanceForm", {
            title: "Create BookInstance",
            books
        });
    });
};

exports.bookInstance_create_post = [
    body("book", "Book must be specified.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("imprint", "Imprint must be specified.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("status")
        .escape(),
    body("due_back", "Invalid date")
        .optional({ checkFalsy: true })
        .isISO8601()
        .toDate(),
    (req, res, next) => {
        const errors = validationResult(req);
        const bookInstance = new BookInstance(req.body);
        if (!errors.isEmpty()) {
            Book.find({}, "title")
                .exec((err, books) => {
                    if (err) return res.next(err);
                    res.render("bookInstanceForm", {
                        title: "Create BookInstance",
                        books,
                        selectedBook: bookInstance.book._id,
                        errors: errors.array(),
                        bookInstance
                    });
                });
            return;
        }
        bookInstance.save((err) => {
            if (err) return next(err);
            res.redirect(bookInstance.url);
        });
    }
];

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