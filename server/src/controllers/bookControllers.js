const bookModels = require("../models/bookModels");
//const sellerModel = require("../models/sellerModels");
//const reviewModels = require("../models/orderModels")
const {uploadFile} = require("../aws_connection/aws")

const { isPresent, isValidObjectId, isValidDate,isValidName } = require("../middlewares/validations");


const createBooks = async function (req, res) {
    try {
        const sellerId = req.decodedToken
        let { name, price, releasedAt } = req.body;
        const data = {};
        if (!isPresent(name)) return res.status(400).send({ status: false, message: "Please enter name" })
        if (!isValidName(name)) return res.status(400).send({ status: false, message: "Name should be in alphabets" })
        let checkName = await bookModels.findOne({ name: name })
        if (checkName) return res.status(400).send({ status: false, message: "The Same name book is already present" })
        data.name = name;

        if (!price) {
            return res.status(400).send({ status: false, message: "Please enter price" })
        }
        price = parseInt(price)
    
        // if (!/^[-\\+]?\s*((\d{1,3}(,\d{3})*)|\d+)(\.\d{2})?$/.test(price)) return "price should only decimal number or number "
        data.price = price
        
        data.sellerId = sellerId;

        if (!isPresent(releasedAt)) return res.status(400).send({ status: false, message: "Please enter release date" })
        if (!isValidDate(releasedAt)) return res.status(400).send({ status: false, message: "Date format should be in (YYYY-MM-DD)" })
        data.releasedAt = releasedAt;


        let files = req.files
        console.log(files)
        if (files && files.length > 0) {

            let uploadedFileURL = await uploadFile(files[0])
            data.bookCover = uploadedFileURL
        }
        let book = await bookModels.create(data)

        return res.status(201).send({ status: true, message: "Book added successfully", data: book })


    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

const getBooks = async (req, res) => {
    try {
        let findData = req.query;
        const {title, userId, category, subcategory } = findData
        if (Object.keys(findData).length === 0) {
            let bookDetails = await bookModels.find({isDeleted:false}).sort({price:1})
            if (bookDetails.length == 0) return res.status(404).send({ status: false, message: "No books found" });
            return res.status(200).send({ status: true, message: "all Books list", "no. of books": bookDetails.length, data: bookDetails });
        }
        if(title ==='' || title == "null"){
            return res.status(400).send({ status: false, message: "Please enter title " })
        }
       
        if (title || userId || category || subcategory) {
            
            if (userId) {
                if (!isValidObjectId(findData.userId)) return res.status(400).send({ status: false, message: "UserId is not Correct" });
            }
            findData.isDeleted = false;
            if (category) {
                if (!isPresent(category)) return res.status(400).send({ status: false, message: "Please enter Category" })
                findData.category = category;
            }

            let bookDetails = await bookModels.find(findData).sort({title:1}).select({title:1,excerpt:1,userId:1,category:1,reviews:1,releasedAt:1,bookCover:1})
            if (bookDetails.length == 0) return res.status(404).send({ status: false, message: "No books found" });
            return res.status(200).send({ status: true, message: "All Books list", "no. of books": bookDetails.length, data: bookDetails });
        }
        return res.status(400).send({ status: false, message: "Query should be in userId, category and subcategory" });
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
};

const getBookById = async function (req, res) {
    try {
        let data = req.params
        let bookId = data.bookId

        if (!data) return res.status(400).send({ status: false, message: "please provide book id in params" })
        if (!isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "bookId is not correct" });
        const bookData = await bookModels.findOne({ _id: bookId, isDeleted: false }).lean().select({ __v: 0 })
        if (!bookData) return res.status(404).send({ status: false, message: "No data found or deleted" })

        return res.status(200).send({ status: true, message: "Books list", data: bookData })

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

const updateBook = async function (req, res) {
    try {
        let bookId = req.params.bookId;
        let id = await bookModels.findById(bookId)
        if (!id) return res.status(404).send({ status: false, message: "book not found" })
        if (id.isDeleted == true) return res.status(404).send({ status: false, message: "book is already deleted, you can't update" })

        let data1=req.body
        let empty= Object.values(data1)
        if(empty.join("")==""){
            return res.status(400).send({ status: false, message: "Please enter what you want to update" }) 
        }
        //let { title, excerpt, category, releasedAt,reviews, ISBN } = req.body;
        let { name, price, releasedAt,reviews } = req.body;
        const data = {};

        if (name) {
            let checkName = await bookModels.findOne({ name: name })
            if (checkName) return res.status(400).send({ status: false, message: "The Same name book is already present" })
            data.name = name;
        }

        if (price) { data.price = parseInt(price); }

        if (releasedAt) {
            if (!isValidDate(releasedAt)) return res.status(400).send({ status: false, message: "Date format should be in (YYYY-MM-DD)" })
            data.releasedAt = releasedAt;
        }

        if (reviews) { data.reviews = reviews; }

        let files = req.files
        if (files && files.length > 0) {

            let uploadedFileURL = await uploadFile(files[0])
            data.bookCover = uploadedFileURL
        }

        let update = await bookModels.findOneAndUpdate({ _id: bookId }, data, { new: true })
        return res.status(200).send({ status: true, message: "Success", data: update });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

const deleteBookById = async function (req, res) {
    try {
        let bookId = req.params.bookId
        if (!bookId) return res.status(400).send({ status: false, message: "please provide book id in params" })
        if (!isValidObjectId(bookId)) return res.status(400).send({ status: false, msg: "bookId is incorrect" })

        let bookData = await bookModels.findById(bookId)
        if (!bookData) return res.status(404).send({ status: false, message: "No data found" })
        if (bookData.isDeleted == false) {
            await bookModels.findOneAndUpdate({ _id: bookId }, { $set: { isDeleted: true, deletedAt: Date() } }, { new: true })
        } else {
            return res.status(404).send({ status: false, message: "Given Id Book data is already deleted" })
        }
        return res.status(200).send({ status: true, message: " Data is successfully deleted" })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


module.exports = { createBooks, getBooks, getBookById, updateBook, deleteBookById }