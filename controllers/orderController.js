const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const Order = require('../models/orderModel');
const { verifyToken } = require('../controllers/userController');

require('dotenv').config();


//CREATE USER ORDER
exports.createOrder = asyncHandler(async (req, res) => {
  const token = req.headers.authorization; // Extract the token from the Bearer token
  const user = await User.findById(req.userId);

  if (!token) {
    res.status(401);
    throw new Error('No token, authorization denied');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    console.log(decoded);
    if(user) {
      const order = new Order({
        user: req.userId, // Use req.userId instead of userId
        products: req.body.products,
        totalPrice: req.body.totalPrice,
      });
      const createdOrder = await order.save();
      res.status(201).json(createdOrder);
    } else {
      res.status(404);
      throw new Error('User not found try again');
    }
  } catch (error) {
    res.json({
      message: error.message,
      error: error.stack,
      stack: process.env.NODE_ENV === 'development' ? error.stack : null
    })
  }
});

//GET USER ORDERS
exports.getUserOrders = asyncHandler(async (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    res.status(401);
    throw new Error('No token, authorization denied');
  }
  try {
    const response = await fetch('http://localhost:3000/api/orders', { 
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  
    if (!response.ok) {
      if (response.status === 401) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
    }
  
    const data = await response.json();
  
    try {
      const orders = await Order.find({ userId: req.userId }).populate('products.product');
      console.log(orders);
      res.json(orders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      res.status(500).json({ message: 'Failed to fetch orders' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred' });
  }
});






exports.getUserOrderById = asyncHandler(async (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    res.status(401);
    throw new Error('No token, authorization denied');
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user
     = await User.findById(decoded._id);
    if(user) {
      const order = user.orders.find(order => order._id.toString() === req.params.id);
      if(order) {
        res.json(order);
      } else {
        res.status(404);
        throw new Error('Order not found');
      }
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    res.status(401);
    throw new Error(error.message);
  }
});




exports.updateUserOrders = asyncHandler(async (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    res.status(401);
    throw new Error('No token, authorization denied');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);
    if(user) {
      user.orders = req.body.orders;
      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    res.status(401);
    throw new Error('Token is not valid');
  }
});
exports.updateUserOrderById = asyncHandler(async (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    res.status(401);
    throw new Error('No token, authorization denied');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);
    if(user) {
      const order = user.orders.find(order => order._id.toString() === req.params.id);
      if(order) {
        order.products = req.body.products || order.products;
        const updatedUser = await user.save();
        res.json(updatedUser);
      } else {
        res.status(404);
        throw new Error('Order not found');
      }
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    res.status(401);
    throw new Error('Token is not valid');
  }
});


exports.deleteUserOrderById = asyncHandler(async (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    res.status(401);
    throw new Error('No token, authorization denied');
  }
  try {
    if(user) {
      user.orders = user.orders.filter(order => order._id.toString() !== req.params.id);
      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    res.status(401);
    throw new Error('Token is not valid');
  }
});



























// const Order = require('../models/orderModel');

// // Get all orders
// exports.getAllOrders = async (req, res) => {
//     try {
//         const orders = await Order.find({});
//         res.status(200).json(orders);
//     } catch (error) {
//         console.log(error.message);
//         res.status(500).json({message: error.message});
//     }
// };


// //hämtar produkter med specifikt id
// exports.getOrderById = async (req, res) => {
//     try {
//         const {id} = req.params;
//         const order = await Order.findById(id);
//         res.status(200).json(order);
        
//     } catch (error) {
//         console.log(error.message);
//         res.status(500).json({message: error.message});
        
//     }
// };


// //Skapar en ny produkt
// exports.createOrder = async (req, res) => {
//     try {
//         const order = await Order.create(req.body);
//         res.status(201).json(order);
        
//     } catch (error) {
//         console.log(error.message);
//         res.status(500).json({message: error.message});
        
//     }
// };

// //Uppdaterar en produkt med specifikt id
// exports.updateOrderById = async (req, res) => {
//     try {
//         const {id} = req.params;
//         const order = await Order.findByIdAndUpdate
//         (id, req.body);
//         if (!order) {
//             return res.status(404).json({message: `order with id ${id} not found`});
//         }
//         const updatedOrder = await Order.findById(id);
//         res.status(200).json(updatedOrder);
//     } catch (error) {
//         console.log(error.message);
//         res.status(500).json({message: error.message});
        
//     }};

// //Tar bort en produkt med specifikt id
// exports.deleteOrderById = async (req, res) => {
//     try {
//         const {id} = req.params;
//         const order = await Order.findByIdAndDelete(id);
//         if (!order) {
//             return res.status(404).json({message: `order with id ${id} not found`});
//         }
//         res.status(200).json({message: `order with id ${id} deleted`});
        
//     } catch (error) {
//         console.log(error.message);
//         res.status(500).json({message: error.message});
        
//     }
// };




// //GET USER ORDERS-----------------------------------------------
// exports.getUserOrders = asyncHandler(async (req, res) => {
//     const user = await User.findById(req.userId)
//     if(user) {
//       const orders = await Order.find({ user: user._id })
//       res.json(orders)
//     } else {
//       res.status(404)
//       throw new Error('User not found')
//     }
//   })
  
//   //CREATE USER ORDER-----------------------------------------------
//   exports.updateUserOrders = asyncHandler(async (req, res) => {
//     const user = await User.findById(req.userId)
//     if(user) {
//       user.orders = req.body.orders
//       const updatedUser = await user.save()
//       res.json(updatedUser)
//     } else {
//       res.status(404)
//       throw new Error('User not found')
//     }
//   })
  
//   //DELETE USER ORDERS-----------------------------------------------
//   exports.deleteUserOrders = asyncHandler(async (req, res) => {
//     const user = await User.findById(req.userId)
//     if(user) {
//       user.orders = []
//       const updatedUser = await user.save()
//       res.json(updatedUser)
//     } else {
//       res.status(404)
//       throw new Error('User not found')
//     }
//   })
  
//   //GET USER ORDER BY ID-----------------------------------------------
//   exports.getUserOrderById = asyncHandler(async (req, res) => {
//     const user = await User.findById(req.userId)
//     if(user) {
//       const order = user.orders.find(order => order._id.toString() === req.params.id)
//       if(order) {
//         res.json(order)
//       } else {
//         res.status(404)
//         throw new Error('Order not found')
//       }
//     } else {
//       res.status(404)
//       throw new Error('User not found')
//     }
//   })
  
//   //UPDATE USER ORDER BY ID-----------------------------------------------
//   exports.updateUserOrderById = asyncHandler(async (req, res) => {
//     const user =
//       await User.findById(req.userId)
//     if(user) {
//       const order = user.orders.find(order => order._id.toString() === req.params.id)
//       if(order) {
//         order.products = req.body.products || order.products
//         const updatedUser = await user.save()
//         res.json(updatedUser)
//       } else {
//         res.status(404)
//         throw new Error('Order not found')
//       }
//     } else {
//       res.status(404)
//       throw new Error('User not found')
//     }
//   })
  
//   //DELETE USER ORDER BY ID-----------------------------------------------
//   exports.deleteUserOrderById = asyncHandler(async (req, res) => {
//     const user =
//       await User.findById(req.userId)
//     if(user) {
//       user.orders = user.orders.filter(order => order._id.toString() !== req.params.id)
//       const updatedUser = await user.save()
//       res.json(updatedUser)
//     } else {
//       res.status(404)
//       throw new Error('User not found')
//     }
//   });