const express = require("express");
const authorController = require("../controllers/authorController");
const bookInstanceController = require("../controllers/bookInstanceController");
const genreController = require("../controllers/genreController");
const bookController = require("../controllers/bookController");

const router = express.Router();

// Home
router.get("/", bookController.index);

// Book
router.get("/book/create", bookController.book_create_get);
router.post("/book/create", bookController.book_create_post);
router.get("/book/:id/delete", bookController.book_delete_get);
router.post("/book/:id/delete", bookController.book_delete_post);
router.get("/book/:id/update", bookController.book_update_get);
router.post("/book/:id/update", bookController.book_update_post);
router.get("/book/:id", bookController.book_detail);
router.get("/books", bookController.book_list);

//Author
router.get("/author/create", authorController.author_create_get);
router.post("/author/create", authorController.author_create_post);
router.get("/author/:id/delete", authorController.author_delete_get);
router.post("/author/:id/delete", authorController.author_delete_post);
router.get("/author/:id/update", authorController.author_update_get);
router.post("/author/:id/update", authorController.author_update_post);
router.get("/author/:id", authorController.author_detail);
router.get("/authors", authorController.author_list);

//Genre
router.get("/genre/create", genreController.genre_create_get);
router.post("/genre/create", genreController.genre_create_post);
router.get("/genre/:id/delete", genreController.genre_delete_get);
router.post("/genre/:id/delete", genreController.genre_delete_post);
router.get("/genre/:id/update", genreController.genre_update_get);
router.post("/genre/:id/update", genreController.genre_update_post);
router.get("/genre/:id", genreController.genre_detail);
router.get("/genres", genreController.genre_list);

//BookInstance
router.get("/bookInstance/create", bookInstanceController.bookInstance_create_get);
router.post("/bookInstance/create", bookInstanceController.bookInstance_create_post);
router.get("/bookInstance/:id/delete", bookInstanceController.bookInstance_delete_get);
router.post("/bookInstance/:id/delete", bookInstanceController.bookInstance_delete_post);
router.get("/bookInstance/:id/update", bookInstanceController.bookInstance_update_get);
router.post("/bookInstance/:id/update", bookInstanceController.bookInstance_update_post);
router.get("/bookInstance/:id", bookInstanceController.bookInstance_detail);
router.get("/bookinstances", bookInstanceController.bookInstance_list);

module.exports = router;
