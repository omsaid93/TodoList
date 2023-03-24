const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");


//generate Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
  };

const registerUser = asyncHandler(async (req,res)=>{
    const {email} = req.body;

    //validation
    if (!email){
        res.status(400);
        throw new Error('please fill all required fields');
    }

    const userExist = await User.findOne({email});
    if (userExist){
        res.status(400);
        throw new Error('Email already exist please login');
    }
    const user = await User.create({email})

    const token = generateToken(user._id);
    
    res.setHeader('Authorization', 'Bearer ' + token);

    if (user) {
        const { _id, email} = user;
        res.status(201).json({
          _id,
          email,
          token,
        });
      } else {
        res.status(400);
        throw new Error("Invalid user data");
      }
})

const loginUser = asyncHandler(async(req,res)=>{
    const {email} = req.body;

    if(!email) {
        res.status(400);
        throw new Error ('please put the email');
    }

    const user = await User.findOne({email});
    
    if(!user){
        res.status(400);
        throw new Error ('User not found, please signUp');
    }

    const token = generateToken(user._id);

    res.setHeader('Authorization', 'Bearer ' + token);

    if(user){
        const {_id, email} = user;
        res.status(200).json({
            _id,
            email,
            token,
        });
    }else{
        res.status(400);
        throw new Error ('invalid user data')
    }
})

module.exports = {registerUser,loginUser}