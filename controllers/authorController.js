const async = require("async");
const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");
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
    res.render("authorForm", { title: "Create Author" });
};

exports.author_create_post = [
    body("first_name")
        .trim()
        .isLength({ min: 1 })
        .withMessage("First name must be specified.")
        .isAlpha()
        .withMessage("First name has non-alphanumeric characters."),
    body("family_name")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Family name must be specified.")
        .isAlpha()
        .withMessage("Family name has non-alphanumeric chracters."),
    body("date_of_birth", "Invalid date of birth")
        .optional({ checkFalsy: true })
        .isISO8601()
        .toDate(),
    body("date_of_death", "Invalid date of daeth")
        .optional({ checkFalsy: true })
        .isISO8601()
        .toDate(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render("authorForm", { 
                title: "Create Author", 
                author: req.body,
                errors: errors.array() 
            });
        }
        const author = new Author(req.body);
        author.save((err) => {
            if (err) return next(err);
            return res.redirect(author.url);
        });
    }
];

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
