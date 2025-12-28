const mongoose = require("mongoose")

const connectionRequestSchema = new mongoose.Schema(
    {
        fromUserId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true,
        },
        toUserId : {
            type : mongoose.Schema.Types.ObjectId,
            required : true,
        },
        status : {
            type: String,
            enum : {
                values : ["ignored","intrested","rejected","accepted"],
                message : "{VALUE} is not a valid status field",
            },
            required : true,
        },
    },
    {
        timestamps : true,
    }
)

connectionRequestSchema.index({fromUserId : 1, toUserId : 1});
const ConnectionRequest = new mongoose.model("ConnectionRequest",connectionRequestSchema);

module.exports = {ConnectionRequest};