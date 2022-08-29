const async = require("async");
const mongoose = require("mongoose");
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
            err.status(404);
            return next(err);
        }
            
        return res.render("genreDetail", { title: "Genre Detail", genre: results.genre, books: results.books });
    })
};

exports.genre_create_get = (req, res) => {
    res.send("Not implemented: Genre create get");
};

exports.genre_create_post = (req, res) => {
    res.send("Not implemented: Genre create post");
};

exports.genre_delete_get = (req, res) => {
    res.send("Not implemented: Genre delete get");
};

exports.genre_delete_post = (req, res) => {
    res.send("Not implemented: Genre delete post");
};

exports.genre_update_get = (req, res) => {
    res.send("Not implemented: Genre update get");
};

exports.genre_update_post = (req, res) => {
    res.send("Not implemented: Genre update post");
};