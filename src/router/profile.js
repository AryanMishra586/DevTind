const express = require("express")
const profileRouter = express.Router();
const {userauth} = require("../middlewares/auth.js")


profileRouter.get("/profile",userauth,async(req,res)=>{
    try{
        const user= req.user;
        res.send(user)
    }
    catch(err){
        res.status(404).send(err.message);
    }
})

module.exports = profileRouter;


