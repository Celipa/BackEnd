const express = require('express');
const router = express.Router();
const {
    getAllProducts, // changed from getProducts to getAllProducts
    getProductById,
    getProductByCategory,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');

router.get('/products', getAllProducts); // changed from getProducts to getAllProducts
router.get('/products/:id', getProductById);
router.get('/products?category=${selectedCategory}', getProductByCategory);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

module.exports = router;