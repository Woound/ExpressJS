const mongoose = require('mongoose');
const Product = require("./models/product.js");
mongoose.set("strictQuery", true);

main().catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/farmStand');
    console.log("Mongo Connection Open!");
}

const seedProducts = [
    {
        name: "Ruby Grapefruit",
        price: 1.99,
        category: "fruit"
    },
    {
        name: "Special Mango",
        price: 3.99,
        category: "fruit"
    },
    {
        name: "Super Apple",
        price: 2.99,
        category: "fruit"
    }
]

Product.insertMany(seedProducts)
    .then(res => {
        console.log(res);
    })
    .catch(err => {
        console.log(err);
    })