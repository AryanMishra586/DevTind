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
        console.log(connections)
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


module.exports = {userRouter};