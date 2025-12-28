const express = require("express")
const requestRouter = express.Router();
const {userauth} = require("../middlewares/auth.js");
const {ConnectionRequest} = require("../models/connectionRequest.js")
const {User} = require("../models/user.js")

requestRouter.post("/request/send/:status/:toUserId", userauth, async(req,res) =>{

    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        if(!["ignored","intrested"].includes(status)){
            throw new Error(`${status} is not a valid status type`)
        }
        const doesToUserExist = await User.findById(toUserId);
        if(!doesToUserExist){
            throw new Error(`no user with ${toUserId} userid exist`)
        }
        if(fromUserId.toString()===toUserId.toString()){
            throw new Error("You cannot send request to Yourself")
        }
        const doesConnectionAlreadyExist =  await ConnectionRequest.findOne({
            $or : [
                {fromUserId,toUserId},
                {
                    fromUserId : toUserId,
                    toUserId  : fromUserId,
                }
            ]
        })
        if(doesConnectionAlreadyExist){
            throw new Error("Connect Request Already exist");
        }
        const newConnection = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })
        const data = await newConnection.save();
        res.json({
            message : "Connection activity succesfully implemented",
            data
        })
    }
    catch(err){
        res.status(400).send(err.message)
    }





})

requestRouter.post("/request/review/:status/:requestId", userauth , async(req,res)=>{
    try{
        const toUserId = req.user._id;
        const {status,requestId} = req.params;

        if(!["accepted","rejected"].includes(status)){
            throw new Error(`${status} is not a valid status field`)
        }
        const doesConnectionExist = await ConnectionRequest.findOne({
            toUserId: toUserId,
            status : "intrested",
            _id : requestId
        })
        if(!doesConnectionExist){
            throw new Error("No such connection request found");
        }
        doesConnectionExist.status = status;
        const data = await doesConnectionExist.save();
        res.json({
            message : "Connection status was updated to "+ status,
            data
        })
    }
    catch(err){
        res.status(400).send(err.message);
    }
})


module.exports = {requestRouter};