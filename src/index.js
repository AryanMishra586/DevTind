const express= require("express")

const app=express()

const {connectDb}= require("./config/database.js")

const {User} =require("./models/user.js")

app.use(express.json())

app.post("/signup", async (req,res)=>{

    try{
        const user= new User(req.body);
        await user.save();
        res.send("Data saved")
    }
    catch(err){
        res.status(500).send("Data not saved")
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
        const userid=req.body.userid;
        await User.findByIdAndUpdate(userid,req.body)
        const ch=await User.findById(userid)
        res.send(ch);
    }
    catch(err){
        res.status(500).send("Something went wrong")
    }
})

app.patch("/updateUserByEmail", async(req,res)=>{
    try{
        const updatedUser= await User.findOneAndUpdate({email : req.body.email},req.body,{new : true})

        if(updatedUser){
            res.send(updatedUser)
        }
        else{
            res.status(404).send("User not found")
        }
    }
    catch(err){
        res.status(500).send("Something went wrong")
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
