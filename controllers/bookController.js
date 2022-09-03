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
                    book,
                    errors: errors.array()
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

exports.book_delete_get = (req, res, next) => {
  const id = mongoose.Types.ObjectId(req.params.id);
  async.parallel({
    book(callback) {
      Book.findById(id)
        .populate("author")
        .populate("genre")
        .exec(callback);
    },
    bookInstances(callback) {
      BookInstance.find({ book: id })
        .populate("book")
        .exec(callback);
    },
  },
  (err, results) => {
    if (err) return next(err);
    if (!results.book) return res.redirect("/catalog/books");
    return res.render("bookDelete", {
      title: "Delete Book",
      book: results.book,
      bookInstances: results.bookInstances,
    });
  });
};

exports.book_delete_post = (req, res) => {
    const id = req.body.bookid;
    async.parallel({
      book(callback) {
        Book.findById(id)
          .populate('author')
          .populate('genre')
          .exec(callback);
      },
      bookInstances(callback) {
        BookInstance.find({ book: id })
          .populate('book')
          .exec(callback)
      },
    },
    (err, results) => {
      if (err) return next(err);
      if (!results.book) return res.redirect("/catalog/books");
      if (results.bookInstances.length > 0) {
        res.render("bookDelete", {
          title: "Delete Book",
          book: results.book,
          bookInstances: results.bookInstances,
        })
        return;
      }
      Book.findByIdAndDelete(id, (err) => {
        if (err) return next(err);
        return res.redirect("/catalog/books");
      });
    });
};

exports.book_update_get = (req, res) => {
    const id = mongoose.Types.ObjectId(req.params.id);
    async.parallel({
        book(callback) {
            Book.findById(id)
                .populate("author")
                .populate("genre")
                .exec(callback);
        },
        authors(callback) {
            Author.find({})
                .exec(callback);
        },
        genres(callback) {
            Genre.find({})
                .exec(callback);
        }
    },
    (err, results) => {
        if (err) return next(err);
        if (!results.book) {
            const err = new Error("Book not found.");
            err.status = 404;
            return next(err);
        }
        for(const genre of results.genres) {
            if (results.book.genre.map(genre => genre._id.toString()).includes(genre._id.toString())) {
              genre.checked = 'true';
            }
        }
        res.render('bookForm', {
            title: 'Update Book',
            authors: results.authors,
            genres: results.genres,
            book: results.book,
        });
    });
};

exports.book_update_post = [

  (req, res, next) => {
    console.log(req.body.genre);
    if (!Array.isArray(req.body.genre)) {
      req.body.genre = typeof(req.body.genre) === 'undefined' ? [] : [req.body.genre];
    }
    console.log(req.body.genre);
    next();
  },
  body('title', 'Title must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('author', 'Author must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('summary', 'Summary must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('isbn', 'ISBN must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('genre.*')
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    const book = new Book({
      title: req.body.title,
      summary: req.body.summary,
      author: req.body.author,
      isbn: req.body.isbn,
      genre: typeof(req.body.genre) === 'undefined' ? [] : req.body.genre,
      _id: req.params.id,
    });
    if(!errors.isEmpty()) {
      async.parallel({
        authors(callback) {
          Author.find()
            .exec(callback);
        },
        genres(callback) {
          Genre.find()
            .exec(callback);
        }
      },
      (err, results) => {
        if (err) return next(err);
        for (const genre of results.genres) {
          if (book.genre.map(genre => genre._id.toString()).includes(genre._id.toString())) {
            genre.checked = "true";
          }
        }
        res.render('bookForm', {
          title: 'Update Book',
          authors: results.authors,
          genres: results.genres,
          book,
          errors: errors.array(),
        });
      });
      return;
    }
    Book.findByIdAndUpdate(req.params.id, book, {}, (err, updateBook) => {
      if (err) return next(err);
      return res.redirect(updateBook.url);
    });
  }
];
