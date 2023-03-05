const express = require("express");
const router = express.Router();

const { createSellers, login } = require("../controllers/sellerControllers");
const { createBooks, getBooks } = require("../controllers/bookControllers");
const { authenticate, authorize } = require("../middlewares/auth");
const { createOrder, getOrder,getOrdersByQ } = require("../controllers/orderControllers");


//---------Seller Api's----------//
router.post("/register", createSellers);
router.post("/login", login)

//-----------Book Api's----------//
router.post("/books",authenticate, createBooks)
router.get("/books", getBooks)

//------------review Api's----------//
router.post("/createOrder",  createOrder);
router.get("/getAllOrder", getOrder);
router.get("/getOrdersByQ", getOrdersByQ);


module.exports = router