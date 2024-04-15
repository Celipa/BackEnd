const express = require('express');
const router = express.Router();
const { verifyToken } = require('../controllers/userController');
const {
    getUserOrderById,
    createOrder,
    updateUserOrderById,
    getUserOrders,
    updateUserOrders,
    deleteUserOrderById
} = require('../controllers/orderController');

router.get('/orders', getUserOrders);
router.get('/orders/:id', getUserOrderById);
router.post('/orders', createOrder, verifyToken);
router.put('/orders/:id', updateUserOrders);
router.put('/orders/:id', updateUserOrderById);
router.delete('/orders/:id', deleteUserOrderById);

module.exports = router;