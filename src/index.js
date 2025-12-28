const express= require("express")

const app=express()

const {connectDb}= require("./config/database.js")

const cookieParser = require("cookie-parser")

const {profileRouter} = require("./router/profile.js")
const {authRouter} = require("./router/auth.js")
const {requestRouter} = require("./router/request.js")
const {userRouter} = require("./router/user.js")

app.use(express.json())
app.use(cookieParser())
app.use(authRouter)
app.use(profileRouter)
app.use(requestRouter)
app.use(userRouter)








connectDb().then(()=>{
    console.log("Database Successfully connected");

    app.listen(3000,()=>{
    console.log("Server is running on port 3000");
    })

}).catch((err)=>{
    console.log("DB not connected");
})
