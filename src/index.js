const express= require("express")

const app=express()

const {connectDb}= require("./config/database.js")

const {User} =require("./models/user.js")

const {skillsCheck} = require("./utils/skillsCheck.js")

const bcrypt = require("bcrypt")

const validator = require("validator")

app.use(express.json())

app.post("/signup", async (req,res)=>{

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

app.get("/getUser",async (req,res)=>{
    try{
        const user = await User.find({
            email : req.body.email
        })
        if(user.length){
            res.send(user)
        }
        else{
            res.status(404).send("User not found")
        }
    }
    catch(err){
        res.status(500).send("Something went wrong")
    }
})

app.get("/getUserById",async (req,res)=>{
    try{
        const user = await User.find({
            _id : req.body._id
        })
        if(user.length){
            res.send(user)
        }
        else{
            res.status(404).send("User not found")
        }
    }
    catch(err){
        res.status(500).send("Something went wrong")
    }
})

app.get("/feed", async (req,res)=>{
    try{
        const users = await User.find({})
        if(users.length){
            res.send(users)
        }
        else{
            res.status(404).send("No User found")
        }
    }
    catch(err){
        res.status(500).send("Something went wrong")
    }
})

app.patch("/updateUser", async(req,res)=>{
    try{
        const updateAllowed =["age","gender","about","userid","skills"]
        for(const k of Object.keys(req.body)){
            if(!updateAllowed.includes(k)){
                return res.status(405).send("Update to given filed is not allowed "+k);
            }
        }
        let bd=req.body
        if(!skillsCheck(req,bd)){
            return res.status(400).send("Too many skills added")
        }
        const userid=req.body.userid;
        await User.findByIdAndUpdate(userid,bd,{runValidators : true})
        const ch=await User.findById(userid)
        return res.send(ch);
    }
    catch(err){
        res.status(500).send("Something went wrong "+ err.message)
    }
})

app.patch("/updateUserByEmail", async(req,res)=>{
    try{
        const updateAllowed =["age","gender","about","email","skills"]
        for(const k of Object.keys(req.body)){
            if(!updateAllowed.includes(k)){
                return res.status(405).send("Update to given filed is not allowed "+k);
            }
        }
        let bd=req.body
        if(!skillsCheck(req,bd)){
            return res.status(400).send("Too many skills added")
        }

        const updatedUser= await User.findOneAndUpdate({email : req.body.email},bd,{new : true, runValidators : true})

        if(updatedUser){
            res.send(updatedUser)
        }
        else{
            res.status(404).send("User not found")
        }
    }
    catch(err){
        res.status(500).send("Something went wrong "+ err.message)
    }
})

app.post("/login", async (req,res)=>{
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
        return res.send("User logged in successfully")
    }
    catch(err){
        res.status(404).send(err.message);
    }
})

connectDb().then(()=>{
    console.log("Database Successfully connected");

    app.listen(3000,()=>{
    console.log("Server is running on port 3000");
    })

}).catch((err)=>{
    console.log("DB not connected");
})
