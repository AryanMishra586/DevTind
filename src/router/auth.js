const express = require("express")
const authRouter = express.Router();
const bcrypt = require("bcrypt")
const validator = require("validator")
const jwt = require("jsonwebtoken");
const {User} =require("../models/user.js")

authRouter.post("/signup", async (req,res)=>{

    try{
        let bd=req.body;
        const {firstName,lastName,password,email} = bd;
        if(!validator.isStrongPassword(password)){
            return res.status(400).send("Enter a strong password")
        }
        const npassword = await bcrypt.hash(password,10);
        const user= new User({
            firstName,
            lastName,
            email,
            password:npassword
        });
        await user.save();
        res.send("Data saved")
    }
    catch(err){
        res.status(500).send("Data not saved "+ err.message)
    }
})


authRouter.post("/login", async (req,res)=>{
    try{
        const {emailid,password}= req.body;
        if(!emailid||!password){
            throw new Error("Enter valid credentials");
        }
        const user= await User.findOne({email:emailid})
        if(!user){
            throw new Error("No such user found")
        }
        const passwordCheck= await bcrypt.compare(password,user.password);
        if(!passwordCheck){
            throw new Error("Enter valid credentials");
        }
        const token = jwt.sign({userid : user._id},"MeraNaamAryan@123",{expiresIn:'1d'})
        res.cookie("token",token,{expires: new Date(Date.now()+900000)});
        return res.send("User logged in successfully")
    }
    catch(err){
        res.status(404).send(err.message);
    }
})

authRouter.post("/logout", async(req,res)=>{
    res.cookie("token",null,{expires : new Date(Date.now())}).send("User Logged Out Succesfully");
})


module.exports = authRouter;