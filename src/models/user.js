const mongoose = require("mongoose")
const validator = require('validator');

const userSchema= new mongoose.Schema({
    firstName : {
        type: String,
        required : true,
        maxLength:50,
    },
    lastName : {
        type: String,
        maxLength : 50,
    },
    email : {
        type : String,
        required : true,
        trim : true,
        unique : true,
        lowercase : true,
        validate(v){
            if(!validator.isEmail(v)){
                throw new error("Enter a valid email "+ v);
            }
        },
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
        default : "No about added",
        maxLength : 100,
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