const express = require("express")
const userRouter = express.Router();
const {User} = require("../models/user.js")
const {ConnectionRequest} = require("../models/connectionRequest.js")
const {userauth} = require("../middlewares/auth.js")

userRouter.get("/user/requests/pending", userauth, async (req,res) =>{

    try{
        const curUser = req.user;
        
        const pendingRequest = await ConnectionRequest.find({
            toUserId : curUser._id,
            status : "intrested"
        }).populate("fromUserId","firstName lastName about gender age skills")


        res.json({
            message : "Here are your pending connection requests",
            data: pendingRequest
        })
    }
    catch(err){
        res.status(400).send(err.message);
    }
    
})


module.exports = {userRouter};