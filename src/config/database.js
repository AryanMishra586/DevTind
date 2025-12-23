const mongoose = require("mongoose")

const connectDb= async ()=>{
    await mongoose.connect("mongodb+srv://aryanmishra12112003:mongolelo%40123@cluster0.xdywl8h.mongodb.net/devTinder")
}

module.exports={connectDb}