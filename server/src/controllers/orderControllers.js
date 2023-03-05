const { isValidObjectId, isValidDate, isPresent, isValidRating, isValidName } = require("../middlewares/validations");
const orderModels = require("../models/orderModels")
const bookModels = require("../models/bookModels");

const createOrder = async function (req, res) {
    try {
        //let bookId = req.params.bookId
        let { bookName, orderedAt, bookPrice, } = req.body

        if (Object.entries(req.body).length == 0) return res.status(400).send({ status: false, message: "please provide order information" })
        //if (!bookId) return res.status(400).send({ status: false, message: "please provide book id in params" })

        let data = {}
        // if (!isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "bookId is not Correct" })
        // let availableBook = await bookModels.findOne({ _id: bookId, isDeleted: false })
        // if (!availableBook) return res.status(404).send({ status: false, message: "book not found or Deleted" })
        // data.bookId = bookId;

        if (!bookName) return res.status(400).send({ status: false, message: "please enter bookName" })
        if (!isValidName(bookName)) return res.status(400).send({ status: false, message: "Book name should be in alphabets" })
        data.bookName = bookName;

        if (!bookPrice) return res.status(400).send({ status: false, message: "please enter bookPrice" })
        bookPrice = parseInt(bookPrice)
        data.bookPrice = bookPrice;

        if (orderedAt) {
            if (!isValidDate(orderedAt)) return res.status(400).send({ status: false, message: "Date format should be in (YYYY-MM-DD)" })
            data.orderedAt = orderedAt;
        }
        if (!orderedAt) data.orderedAt = Date();

        let orderData = await orderModels.create(data)
        // await bookModels.updateOne({ _id: bookId}, { $inc: { order: 1 } })
        return res.status(201).send({ status: true, message: "Book Ordered Successfull", data: orderData });

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
}

const getOrder = async (req, res) => {
    try {

        let orderDetails = await orderModels.find({ isDeleted: false }).sort({bookPrice:1}).sort({createdAt:-1})
        if (orderDetails.length == 0) return res.status(404).send({ status: false, message: "No order found" });
        return res.status(200).send({ status: true, message: "All Ordered list", "no. of Ordered": orderDetails.length, data: orderDetails });

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
}
const getOrdersByQ = async (req, res) => {
    try {
        let findData = req.query;
        //console.log( findData.bookName)
        const {bookName} = findData
        
        if(bookName ==='' || bookName == "null"){
            return res.status(400).send({ status: false, message: "Please enter data " })
        }
       
        

            let bookDetails = await orderModels.find(findData).sort({bookPrice:1}).sort({createdAt:-1})
            if (bookDetails.length == 0) return res.status(404).send({ status: false, message: "No order found" });
            return res.status(200).send({ status: true, message: "All Orders list", "totalOrders": bookDetails.length, data: bookDetails });
        
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
};



module.exports = { createOrder, getOrder,getOrdersByQ }
