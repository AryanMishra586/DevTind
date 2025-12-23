const express= require("express")

const app=express()

app.use("/user",[(req,res,next)=>{
    console.log("Response 1")
    next()
},
(req,res,next)=>{
    console.log("Response 2")
    next();
},
(req,res,next)=>{
    console.log("Response 3")
    next();
}],
(req,res,next)=>{
    console.log("Response 4")
    next();
},
(req,res,next)=>{
    console.log("Response 5")
    // res.send("bye")
    next();
}
)

app.get("/user/:id",(req,res)=>{
    console.log(req.params)
    console.log(req.query)
    res.send("Here is user info")
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