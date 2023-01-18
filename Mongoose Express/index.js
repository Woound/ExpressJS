const express = require("express");
app = express();
const path = require("path");
const mongoose = require('mongoose');
mongoose.set("strictQuery", true);
const methodOverride = require("method-override");

const Product = require("./models/product.js");

main().catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/farmStand');
    console.log("Mongo Connection Open!");
}


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));


const categories = ["fruit", "vegetable", "dairy", "fungi"];
app.get("/products", async (req, res) => {
    const { category } = req.query;
    if (category) {
        const products = await Product.find({ category });
        res.render("products/index.ejs", { products, category });
    } else {
        const products = await Product.find({});
        res.render("products/index.ejs", { products, category: "All" });
    }
})

app.get("/products/new", (req, res) => {
    res.render("products/new.ejs", { categories });
})

app.post("/products", async (req, res) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.redirect(`/products/${newProduct._id}`);
})

app.get("/products/:id", async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render("products/show.ejs", { product });
})

app.get("/products/:id/edit", async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render("products/edit.ejs", { product, categories });
})

app.put("/products/:id", async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    res.redirect(`/products/${product._id}`);
})

app.delete("/products/:id", async (req, res) => {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    res.redirect("/products/");
})


app.listen(3000, () => {
    console.log("Listening on port 3000.")
})