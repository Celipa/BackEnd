const asyncHandler = require('express-async-handler');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); // replace with your actual User model path
require('dotenv').config();

// //REGISTER USER--------------------------------------------

exports.registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if(!firstName || !lastName || !email || !password) {
    res.status(400)
    throw new Error('You need to enter all the fields')
  }
  //check if the user already exists
  const userExists = await User.exists({ email })
  if(userExists) {
    res.status(400)
    throw new Error('The account is already registered. Please login.')
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,

  })
  // const updatedUser = await User.find({});
  //       res.status(200).json(updatedUser);
  //       console.log(updatedUser);
  //       console.log(result);
  res.status(201).json({message: "User Created Succesfully!", user });
});



//LOGIN USER-----------------------------------------------
exports.loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //if the email or password is missing

  if (!email || !password) {
    res.status(400);
    throw new Error('You need to enter all the fields');
  }
  //find the user by email
  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(400).json({ message: 'Incorrect email or password' });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.status(200).json({
      _id: user._id,
      email: user.email,
      message: 'Login successful',
      token: token,
    },
  );
  console.log(token);
    console.log(user._id);
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.userId = decoded._id;
  req.token = decoded.token;
  localStorage.setItem('token', token);
  localStorage.setItem('user', req.userId);
  console.log(req.userId)
  next();
  
}
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: error.message });
  }
});

//GET USER PROFILE-----------------------------------------------
exports.getUserProfile = asyncHandler(async (req, res) => {
  // const user = await User.findById(req.userId).select('-passwordHash')
  const user = await User.findById(req.userId);

if (!user) {
  res.status(404);
  throw new Error('User not found');
}
  res.status(200).json({
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    token: user.token,
    displayName: user.displayName
   })
})

//UPDATE USER PROFILE-----------------------------------------------
exports.updateUserProfile = asyncHandler(async (req, res) => {

  const user = await User.findById(req.userId)
  if(!user) {
    res.status(404)
    throw new Error('User not found!')
  }

  user.firstName = req.body.firstName || user.firstName
  user.lastName = req.body.lastName || user.lastName

  if(req.body.email) {

    const userExists = await User.exists({ email: req.body.email })
    if(userExists) {
      res.status(400)
      throw new Error('The email address is already taken')
    }

    user.email = req.body.email
  }

  if(req.body.password) {
    user.passwordHash = await bcrypt.hash(req.body.password, 10);
  }

  const updatedUser = await user.save()

  res.status(200).json({
    _id: updatedUser._id,
    firstName: updatedUser.firstName,
    lastName: updatedUser.lastName,
    email: updatedUser.email,
    token: updatedUser.token,
    displayName: updatedUser.displayName
  })
})

//DELETE USER PROFILE-----------------------------------------------
exports.deleteUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId)

  if(user) {
    await user.remove()
    res.json({ message: 'User removed' })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

//GET ALL USERS-----------------------------------------------
exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({})
  res.json(users)
})

//GET USER BY ID-----------------------------------------------
exports.getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
  if(user) {
    res.json(user)
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

//UPDATE USER-----------------------------------------------
exports.updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
  if(user) {
    user.firstName = req.body.firstName || user.firstName
    user.lastName = req.body.lastName || user.lastName
    user.email = req.body.email || user.email
    user.displayName = req.body.displayName || user.displayName
    if(req.body.password) {
      user.passwordHash = await bcrypt.hash(req.body.password, 10);
    }
    const updatedUser = await user.save()
    res.json({
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      displayName: updatedUser.displayName,
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

exports.verifyToken = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Not authorized' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded._id;
    next();
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: error.message });
  }
}
)