const express= require("express")

const app=express()

const {userauth,adminauth}= require("./middlewares/auth.js")

app.use("/admin",adminauth)

app.post("/user/login",(req,res)=>{
    res.send("logged in")
})

app.get("/user",userauth,(req,res)=>{
    res.send("Here is user info")
})

app.get("/admin/read",(req,res)=>{
    res.send("Hello admin")
})

app.post("/admin/putu",(req,res)=>{
    res.send("Naughty admin")
})

app.post("/user",(req,res)=>{
    res.send("Data saved succesfully")
})

app.put("/user",(req,res)=>{
    res.send("Data updated")
})

app.delete("/user",(req,res)=>{
    res.send("Data deleted")
})

app.patch("/user",(req,res)=>{
    res.send("Data updated diffrently")
})

app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})