require('dotenv').config('../.env');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/usermodel');
const checkAuth = require('../middleware/userauth');
const mailerUtil = require('../utilities/nodemailer');



exports.registerUser = async (req, res, next) => {
    const email=req.body.email
    try {
        const oldUser = await User.findOne({ email }
        );

        if (oldUser) 
            res.status(400).json({ message: "USER Exists!!" });
        const user = new User({
            username: req.body.username,
            password: req.body.password,
            email:req.body.email,
        });
        const saved_user = await user.save();
        console.log(saved_user)
        res.json({status: true, message: "Registered!!!", data: saved_user});
        mailerUtil.registerMail(req.body.email, req.body.username);
    } 
    catch (error) {
        res.status(400).json({status: false, message: "ERROR!!", data: error});
    }
}

exports.loginUser = (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    try {
        const user = await User.findOne({ email }).exec()
        if (!user) {
            res.status('401').json({
                error: "404 User not found!"
              })
        }
        const isMatch = await bcrypt.compare(password, user.password)
    
        if (!isMatch) {
            res.status('401').send({
                error: "ERROR!!"
            })
        }
        if(user === null) 
            res.status(401).json({status: false, message: "Not valid."});
        const access_token = jwt.sign({sub: user._id}, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_ACCESS_TIME});
        res.json({status: true, message: "Success", data: {access_token}});
    } 
    catch (error) 
    {
        res.status(401).json({status: true, message: "Fail", data: error});
    }

}

exports.getAllUsers = async (req, res, next) => {
    try{
        const users=await User.find({})
        if(!users){
           res.status(404).send();
        }
        res.send(users)
    }
    catch(error){
        res.status(500).send()
    }
}

exports.updateUser = (req, res, next) => {
    try {
        const id=req.user_id;
        const {username,email,password }=req.body;
        if(!mongoose.Types.ObjectId.isValid(id)) 
            res.status(404).send(`No post with id ${id}`);
        const updatedUser={username,email,password,age, _id:id};
        await User.findByIdAndUpdate(id,updatedUser,{new :true});
        res.json(updatedUser);
    } 
    catch (error) {
        res.status(400).send(e)
    }
}

exports.removeUser = async (req, res, next) => {
    try{
        const  user=await User.findByIdAndRemove({ _id :req.user_id});
        if(!user){
           res.status(404).send();
        }
        res.send(user)
    }
    catch(error){
        res.status(500).send();
    }
}

exports.logoutUser = (req, res, next) => {
    const user_id = req.userData.sub;
    const token = req.token;
    
    return res.json({
        status: true, 
        message: "Logout! "});
}
