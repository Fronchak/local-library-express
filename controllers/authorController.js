const async = require("async");
const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");
const Author = require("../models/author");
const Book = require("../models/book");
const getDatePlusTimeZoneOffSet = require('../util/getDatePlusTimeZoneOffSet');

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
        const date_of_birth = req.body.date_of_birth && getDatePlusTimeZoneOffSet(req.body.date_of_birth);
        const date_of_death = req.body.date_of_death && getDatePlusTimeZoneOffSet(req.body.date_of_death);
        const author = new Author({
          first_name: req.body.first_name,
          family_name: req.body.family_name,
          date_of_birth,
          date_of_death,
        });
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render("authorForm", { 
                title: "Create Author", 
                author,
                errors: errors.array() 
            });
            return;
        }
        author.save((err) => {
            if (err) return next(err);
            return res.redirect(author.url);
        });
    }
];

exports.author_delete_get = (req, res) => {
    const id = mongoose.Types.ObjectId(req.params.id);
    async.parallel({
        author(callback) {
            Author.findById(id)
                .exec(callback);
        },
        authorBooks(callback) {
            Book.find({ author: id })
                .exec(callback);
        }
    },
    (err, results) => {
        if (err) return next(err);
        if (!results.author) return res.redirect("/catalog/authors");
        return res.render("authorDelete", {
            title: "Delete Author",
            author: results.author,
            authorBooks: results.authorBooks
        });
    });
};

exports.author_delete_post = (req, res) => {
    const id = mongoose.Types.ObjectId(req.body.authorid);
    async.parallel({
        author(callback) {
            Author.findById(id)
                .exec(callback);
        },
        authorBooks(callback) {
            Book.find({ author: id })
                .exec(callback);
        }
    },
    (err, results) => {
        if (err) return next(err);
        if (results.authorBooks.length > 0) {
            res.render("authorDelete", {
                title: "Delete Author",
                author: results.author,
                authorBooks: results.authorBooks
            });
            return;
        }
        Author.findByIdAndDelete(id, (err) => {
            if (err) return next(err);
            res.redirect("/catalog/authors");
        });
    });
};

exports.author_update_get = (req, res, next) => {
    const id = mongoose.Types.ObjectId(req.params.id);
    Author.findById(id)
      .exec((err, author) => {
        if (err) return next(err);
        res.render('authorForm', {
          title: 'Update Author',
          author
        });
        return;
      });
}

exports.author_update_post = [
  body('first_name')
    .trim()
    .isLength({ min: 1 })
    .withMessage('First name must be especified.')
    .isAlpha()
    .withMessage('First name shoud only have simple characteres.'),
  body('family_name')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Family name must be specified')
    .isAlpha()
    .withMessage('Family name shoud only have simple characteres.'),
  body('date_of_birth', 'Invalid date for date of birth.')
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
  body('date_of_death','Invalid date for date of death.')
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
  (req, res, next) => {
    const errors = validationResult(req);
    const date_of_birth = req.body.date_of_birth && getDatePlusTimeZoneOffSet(req.body.date_of_birth);
    const date_of_death = req.body.date_of_death && getDatePlusTimeZoneOffSet(req.body.date_of_death);
    const id = mongoose.Types.ObjectId(req.params.id);
    const author = new Author({
      _id: id,
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      date_of_birth,
      date_of_death,
    });
    if (!errors.isEmpty()) {
      res.render('authorForm', {
        title: 'Update Author',
        author,
        errors: errors.array(),
      });
      return;
    }
    Author.findByIdAndUpdate(id, author, {}, (err, updatedAuthor) => {
      if (err) return next(err);
      res.redirect(updatedAuthor.url);
      return;
    });
  },
];
