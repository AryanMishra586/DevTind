const express= require("express")

const app=express()


app.use("/test",(req,res)=>{
    res.send("Kya re madharjaat")
})

app.use("/hello",(req,res)=>{
    res.send("hello ji")
})

app.use("/",(req,res)=>{
    res.send("lund le le")
})

app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})