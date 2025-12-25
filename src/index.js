const express= require("express")

const app=express()

const {connectDb}= require("./config/database.js")

const {User} =require("./models/user.js")

app.use(express.json())

app.post("/signup", async (req,res)=>{

    try{
        const skl=[... new Set(req.body?.skills)]
        if(skl.length>10){
            res.status(405).send("No many skills added")
        }
        const bd=req.body;
        bd.skills=skl;
        const user= new User(bd);
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
        let skl=Array.isArray(bd.skills) ? bd.skills:[];
        if(skl.length>0)
        skl=[...new Set(skl)];
        if(skl.length>10){
            return res.status(400).send("Too many skills included");
        }
        bd.skills=skl;
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
        let skl=Array.isArray(bd.skills) ? bd.skills:[];
        if(skl.length>0)
        skl= [...new Set(req.body?.skills)]
        if(skl.length>10){
            res.status(400).send("Too many skills included");
        }
        bd.skills=skl;

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

connectDb().then(()=>{
    console.log("Database Successfully connected");

    app.listen(3000,()=>{
    console.log("Server is running on port 3000");
    })

}).catch((err)=>{
    console.log("DB not connected");
})
