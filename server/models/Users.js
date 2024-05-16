const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema ({
    
    userMail: {
        type: String,
        required : true,
        unique: true,
        lowerCase:true,
    },
    password: {
        type: String,
        required : true,
    },
    userVoted: {
        type: Boolean,
        default:false,
    },
    userSecret: {
        type: String,
        default:null,
    },
    userRole: {
        type: String,
        required : true,

    }

})

const UserModel = mongoose.model("users",UserSchema)

module.exports = UserModel;