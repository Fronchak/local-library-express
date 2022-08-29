const Genre = require("../models/genre");

exports.genre_list = (req, res, next) => {
    Genre.find()
        .sort({ name: 1 })
        .exec(function(err, genres) {
            if(err) return next(err);
            return res.render("genresList", { title: "Genres", genres });
        })
};

exports.genre_detail = (req, res) => {
    res.send("Not implemented: Genre detail: " + req.params.id);
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