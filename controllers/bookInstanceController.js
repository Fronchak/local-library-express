const mongoose = require("mongoose");
const BookInstance = require("../models/bookInstance");

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
    res.send("Not implemented: BookInstance create get");
};

exports.bookInstance_create_post = (req, res) => {
    res.send("Not implemented: BookInstance create post");
};

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