const async = require("async");
const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");
const Genre = require("../models/genre");
const Book = require("../models/book");

exports.genre_list = (req, res, next) => {
    Genre.find()
        .sort({ name: 1 })
        .exec(function(err, genres) {
            if(err) return next(err);
            return res.render("genresList", { title: "Genres", genres });
        })
};

exports.genre_detail = (req, res, next) => {
    const id = mongoose.Types.ObjectId(req.params.id);
    async.parallel({
        genre(callback) {
            Genre.findById(id)
                .exec(callback);
        },
        books(callback) {
            Book.find({ genre: id })
                .sort({ title: 1 })
                .exec(callback)
        }
    },
    (err, results) => {
        if(err) return next(err);
        if(!results.genre) {
            const err = new Error("Genre not found");
            err.status = 404;
            return next(err);
        }
            
        return res.render("genreDetail", { title: "Genre Detail", genre: results.genre, books: results.books });
    })
};

exports.genre_create_get = (req, res) => {
    res.render("genreForm", { title: "Create Genre" });
};

exports.genre_create_post = [
    body("name", "Genre name required")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        const genre = new Genre({ name: req.body.name });
        if (!errors.isEmpty()) {
            return res.render("genreForm", {
                title: "Create Genre",
                genre,
                errors: errors.array()
            });
        }
        else {
            Genre.findOne({ name: req.body.name })
                .exec((err, genreFounded) => {
                    if(err) return next(err);
                    if(genreFounded) return res.redirect(genreFounded.url);
                    else {
                        genre.save((err) => {
                            if(err) return next(err);
                            return res.redirect(genre.url);
                        });
                    }
                });
        }
    }
];

exports.genre_delete_get = (req, res) => {
    const id = mongoose.Types.ObjectId(req.params.id);
    async.parallel({
        genre(callback) {
            Genre.findById(id)
                .exec(callback);
        },
        genreBooks(callback) {
            Book.find({ genre: id })
                .exec(callback);
        }
    },
    (err, results) => {
        if (err) return next(err);
        if (!results.genre) {
            return res.redirect("/catalog/genres");
        }
        res.render("genreDelete", {
            title: "Delete Genre",
            genre: results.genre,
            genreBooks: results.genreBooks
        });
    });
};

exports.genre_delete_post = (req, res) => {
    const id = req.body.genreid;
    Genre.findById(id).exec((err, genre) => {
        if (err) return next(err);
        if (!genre) return res.redirect("/catalog/gentes");
        Genre.findByIdAndDelete(id, (err) => {
            if (err) return next(err);
            return res.redirect("/catalog/genres");
        });
    });
};

exports.genre_update_get = (req, res) => {
    const id = mongoose.Types.ObjectId(req.params.id);
    Genre.findById(id)
      .exec((err, genre) => {
        if (err) return next(err);
        if (!genre) {
          const err = new Error("Genre not found");
          err.status = 404;
          return next(err);
        }
        res.render('genreForm', {
          title: 'Update Genre',
          genre,
        });
        return;
      })
};

exports.genre_update_post = [
  body('name', `Genre's name must be specified.`)
    .trim()
    .isLength({ min: 1 })
    .escape(),
  (req, res, next) => {
    const id = mongoose.Types.ObjectId(req.params.id);
    const errors = validationResult(req);
    const genre = new Genre({
      name: req.body.name,
      _id: id,
    });
    if (!errors.isEmpty()) {
      res.render('genreForm', {
        title: 'Update Genre',
        genre,
        errors: errors.array(),
      });
      return;
    }
    Genre.findOne({ name: req.body.name })
      .exec((err, genreFounded) => {
        if (err) return next(err);
        if (genreFounded) {
          const errors = [{ msg: 'Genre already exists.' }]
          res.render('genreForm', {
            title: 'Update Genre',
            genre,
            errors,
          });
          return;
        }
        Genre.findByIdAndUpdate(id, genre, {}, (err, updatedGenre) => {
          if (err) return next(err);
          return res.redirect(updatedGenre.url);
        });
      });
  }
];
