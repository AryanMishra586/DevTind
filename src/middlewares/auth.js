
const {User} = require("../models/user.js");
const jwt = require("jsonwebtoken")


const userauth=async (req,res,next)=>{
    try{
        const cookies=req.cookies;
        const {token}=cookies;
        if(!token){
            throw new Error("No valid Token found")
        }
        const decoded= jwt.verify(token,"MeraNaamAryan@123")
        const {userid} = decoded;
        const user = await User.findById(userid);
        if(!user){
            throw new Error("No user found");
        }
        req.user=user;
        next();
    }
    catch(err){
        res.status(400).send(err.message);
    }
}

module.exports={
    userauth
}