const mongoose = require("mongoose")

const userSchema= new mongoose.Schema({
    firstName : {
        type: String,
        required : true,
    },
    lastName : {
        type: String
    },
    email : {
        type : String,
        required : true,
        trim : true,
        unique : true,
        lowercase : true,
    },
    age : {
        type : Number,
        min : 5,
        max : 100
    },
    gender : {
        type : String,
        validate(v){
            if(!["Male", "Female", "Others"].includes(v)){
                throw new error("Enter a valid Gender")
            }
        }
    },
    password : {
        type : String,
        required : true,
        minLength : 8,
        maxLength : 20,
        unique : true,
        trim : true,
    },
    about : {
        type : String,
        default : "No about added"
    },
    skills : {
        type : [String],
    }
},
{
    timestamps : true,
})

const User = mongoose.model("User",userSchema)

module.exports = {User}