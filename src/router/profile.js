const express = require("express")
const profileRouter = express.Router();
const {userauth} = require("../middlewares/auth.js")
const bcrypt = require("bcrypt");
const validator = require("validator");


profileRouter.get("/profile/view",userauth,async(req,res)=>{
    try{
        const user= req.user;
        res.send(user)
    }
    catch(err){
        res.status(404).send(err.message);
    }
})

profileRouter.patch("/profile/edit", userauth, async (req,res)=>{
    try{
        const updateAllowedFields = ["firstName","lastName","about","age","gender","skills"]

        const isUpdateAllowed = Object.keys(req.body).every((key)=>(updateAllowedFields.includes(key)))
        if(!isUpdateAllowed){
            throw new Error("Update is not allowed on some of the requested fields")
        }
        const user=req.user;
        Object.keys(req.body).forEach((key)=>{
            user[key]=req.body[key];
        });
        await user.save();
        res.json({
            message : `${user.firstName} your profile is succesfully updated`,
            data : user
        })
    }
    catch(err){
        res.status(400).send(err.message);
    }
})

profileRouter.patch("/profile/password",userauth, async(req,res)=>{
    try{
        const user= req.user;
        const newPassword = req.body?.newPassword;
        const password = req.body?.password;
        if(!newPassword){
            throw new Error("Enter the new Password");
        }
        if(!password){
            throw new Error("Enter the original password")
        }
        const passwordCheck= await bcrypt.compare(password,user.password)
        if(!passwordCheck){
            throw new Error("The provided password is not correct")
        }
        if(!validator.isStrongPassword(newPassword)){
            throw new Error("Enter a strong password")
        }
        user.password= await bcrypt.hash(newPassword,10);
        await user.save();
        res.send("Password successfully updated");
    }
    catch(err){
        res.status(400).send(err.message);
    }
})

module.exports = profileRouter;


