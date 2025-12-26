const express= require("express")

const app=express()

const {connectDb}= require("./config/database.js")

const {User} =require("./models/user.js")

const {skillsCheck} = require("./utils/skillsCheck.js")

const bcrypt = require("bcrypt")

const validator = require("validator")

const jwt = require("jsonwebtoken");

const cookieParser = require("cookie-parser")

const {userauth} = require("./middlewares/auth.js")

app.use(express.json())
app.use(cookieParser())

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
        const token = jwt.sign({userid : user._id},"MeraNaamAryan@123",{expiresIn:'1d'})
        res.cookie("token",token,{expires: new Date(Date.now()+900000)});
        return res.send("User logged in successfully")
    }
    catch(err){
        res.status(404).send(err.message);
    }
})

app.get("/profile",userauth,async(req,res)=>{
    try{
        const user= req.user;
        res.send(user)
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
