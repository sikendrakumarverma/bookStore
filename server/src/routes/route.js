const express = require("express");
const router = express.Router();

const { createSellers, login } = require("../controllers/sellerControllers");
const { createBooks, getBooks, getBookById, updateBook, deleteBookById } = require("../controllers/bookControllers");
const { authenticate, authorize } = require("../middlewares/auth");
const { createOrder, getOrder } = require("../controllers/orderControllers");


//---------Seller Api's----------//
router.post("/register", createSellers);
router.post("/login", login)

//-----------Book Api's----------//
router.post("/books",authenticate, createBooks)
router.get("/books", getBooks)
router.get("/books/:bookId", authenticate, authorize, getBookById)
router.put("/books/:bookId", authenticate, authorize, updateBook)
router.delete("/books/:bookId", authenticate, authorize, deleteBookById)

//------------review Api's----------//
router.post("/createOrder",  createOrder);
router.get("/getAllOrder", getOrder);


module.exports = router