const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = "mongodb+srv://AlvaDb:BytMig123@testdb.s0fjhfi.mongodb.net/NodeAPI"
const Product = require('../models/productModel');

app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json(products);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: error.message});
    }
};

// Get a product by id
exports.getProductById = async (req, res) => {
    try {
        const {id} = req.params;
        const product = await Product.findById(id);
        res.status(200).json(product);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: error.message});
    }
};
exports.getProductByCategory = async (req, res) => {
    try {
        const { category } = req.query;
        const products = await Product.find({ category: category });
        res.status(200).json(products);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: error.message});
    }
};

// Create a new product
exports.createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: error.message});
    }
};

// Update a product by id
exports.updateProduct = async (req, res) => {
    try {
        const {id} = req.params;
        const product = await Product.findByIdAndUpdate(id, req.body);
        if (!product) {
            return res.status(404).json({message: `Product with id ${id} not found`});
        }
        const updatedProduct = await Product.findById(id);
        res.status(200).json(updatedProduct);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: error.message});
    }
};

// Delete a product by id
exports.deleteProduct = async (req, res) => {
    try {
        const {id} = req.params;
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({message: `Product with id ${id} not found`});
        }
        res.status(200).json({message: `Product with id ${id} deleted`});
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: error.message});
    }
};