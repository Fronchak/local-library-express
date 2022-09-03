const mongoose = require("mongoose");
const async = require('async');
const { DateTime } = require("luxon");
const { body, validationResult } = require("express-validator");
const BookInstance = require("../models/bookInstance");
const Book = require("../models/book");
const getDatePlusTimeZoneOffSet = require('../util/getDatePlusTimeZoneOffSet');

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
        const due_back = getDatePlusTimeZoneOffSet(req.body.due_back);
        const bookInstance = new BookInstance({
          book: req.body.book,
          imprint: req.body.imprint,
          due_back,
          status: req.body.status
        });
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

exports.bookInstance_delete_get = (req, res, next) => {
    const id = mongoose.Types.ObjectId(req.params.id);
    BookInstance.findById(id)
        .populate("book")
        .exec((err, bookInstance) => {
            if (err) return next(err);
            if (!bookInstance) return res.redirect("/catalog/bookinstances");
            return res.render("bookInstanceDelete", {
                title: "Delete Book Instance",
                bookInstance
            });
        });
};

exports.bookInstance_delete_post = (req, res) => {
    const id = req.body.bookinstanceid;
    BookInstance.findById(id) 
        .exec((err, bookInstance) => {
            if (err) return next(err);
            if (!bookInstance) return res.redirect("/catalog/bookinstances");
            BookInstance.findByIdAndDelete(id, (err) => {
                if (err) return next(err);
                return res.redirect("/catalog/bookinstances");
            });
        });
};

exports.bookInstance_update_get = (req, res) => {
    const id = mongoose.Types.ObjectId(req.params.id);
    async.parallel({
      books(callback) {
        Book.find()
          .exec(callback);
      },
      bookInstance(callback) {
        BookInstance.findById(id)
          .exec(callback);
      },
    },
    (err, results) => {
      if (err) return next(err);
      if (!results.bookInstance) {
        const err = new Error(`Book's copie not found.`);
        err.status = 404;
        return next(err);
      }
      res.render('bookInstanceForm', {
        title: 'Update Copie',
        bookInstance: results.bookInstance,
        books: results.books,
      });
      return;
    });
};

exports.bookInstance_update_post = (req, res) => {
    res.send("Not implemented: BookInstance update post");
};
