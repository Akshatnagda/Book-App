require("dotenv").config();

const cors = require("cors");

const multer = require("multer");

const express = require("express");

const connectDB = require("./connectDB");

const Book = require("./models/Books");

const app = express();

const PORT = process.env.PORT || 8000;


connectDB();
//Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + "-" + file.originalname);
    },
});

const upload = multer({ storage: storage });


// creating an route
// finding books based on the category
app.get("/api/books", async (req, res) => {

    try {

        const category = req.query.category;

        const filter = {};

        if(category){
            filter.category = category;
        }


        const data = await Book.find(filter);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "An error occured while fetching the books." })
    }

});

// creating route for description of a selected book
app.get("/api/books/:slug", async (req, res) => {

    try {

        const slugParam = req.params.slug;

        const data = await Book.find({ slug: slugParam});
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "An error occured while fetching the books." })
    }

});


// creating a route for adding a new book
app.post("/api/books", upload.single("thumbnail"), async (req, res) => {

    try {
        // console.log(req.body);

        // const { title, slug } = req.body;
        // Get the uploaded file's filename
        // const thumbnail = req.file.filename;

        // create a new book entry with title, slug, and thumbnail
        const newBook = new Book({
            title: req.body.title,
            slug: req.body.slug,
            stars: req.body.stars,
            description: req.body.description,
            category: req.body.category,
            thumbnail: req.file.filename,
        });

        await newBook.save();
        res.status(201).json({ message: "Book created successfully"});
    } catch (error) {
        res.status(500).json({ error: "An error occured while creating the book." })
    }

});
 
// creating a route for updating a existing book
app.put("/api/books", upload.single("thumbnail"), async (req, res) => {

    try {

        const bookId = req.body.bookId

        const updateBook = {
            title: req.body.title,
            slug: req.body.slug,
            stars: req.body.stars,
            description: req.body.description,
            category: req.body.category,
        };

        if(req.file) {
            updateBook.thumbnail = req.file.filename;
        }

        await Book.findByIdAndUpdate(bookId, updateBook);
        res.status(201).json({ message: "Book updated successfully"});
    } catch (error) {
        res.status(500).json({ error: "An error occured while updating the book." })
    }

});


// for deleting
app.delete("/api/books/:id", async (req, res) => {
    const bookId = req.params.id;

    try {
        await Book.deleteOne({ _id: bookId });
        res.json("Book deleted!" + req.body.bookId);
    } catch (error) {
        res.json(error);
    }


});





app.get("/", (req, res) => {
    res.json("Hello there!");
});


app.get("*", (req, res) => {
    res.sendStatus("404");
});



app.listen(PORT, () => {
    console.log(`server is running on PORT: ${PORT}`);
});