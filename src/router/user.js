const express = require("express")
const userRouter = express.Router();
const {User} = require("../models/user.js")
const {ConnectionRequest} = require("../models/connectionRequest.js")
const {userauth} = require("../middlewares/auth.js")

const allowedFields = "firstName lastName about gender age skills"

userRouter.get("/user/requests/pending", userauth, async (req,res) =>{

    try{
        const curUser = req.user;
        
        const pendingRequest = await ConnectionRequest.find({
            toUserId : curUser._id,
            status : "intrested"
        }).populate("fromUserId",allowedFields)


        res.json({
            message : "Here are your pending connection requests",
            data: pendingRequest
        })
    }
    catch(err){
        res.status(400).send(err.message);
    }  
})

userRouter.get("/user/connections",userauth, async(req,res)=>{
    try{
        const curUser = req.user;
        const connections = await ConnectionRequest.find({
            $or : [
                {toUserId : curUser._id,status : "accepted"},
                {fromUserId : curUser._id, status : "accepted"}
            ]
        }).populate("fromUserId",allowedFields).populate("toUserId",allowedFields)
        const data = connections.map((row)=>{

            if(row.fromUserId.equals(curUser._id)){
                return row.toUserId;
            }
            return row.fromUserId;
        })
        res.json({data});
    }
    catch(err){
        res.status(400).send(err.message);
    }

})

userRouter.get("/user/feed", userauth, async(req,res)=>{
    try{
        const curUser=req.user;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        if(limit >50){
            limit=50;
        }
        const connections = await ConnectionRequest.find({
            $or : [
                {toUserId:curUser._id},
                {fromUserId :curUser._id}
            ]
        })
        const connectedUsers = connections.map((row)=>{
            if(row.fromUserId.equals(curUser._id)){
                return row.toUserId;
            }
            return row.fromUserId;
        })
        connectedUsers.push(curUser._id);
        const users = await User.find({
            _id : { $nin : connectedUsers }
        }).select("-password -email -createdAt -updatedAt -__v").skip(skip).limit(limit);
        res.json({
            message : "Here are the users you might be intrested in",
            data: users
        })
    }
    catch(err){
        res.status(400).send(err.message);
    }

})

module.exports = {userRouter};