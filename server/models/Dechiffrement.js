const mongoose = require("mongoose")

const DechiffrementSchema = new mongoose.Schema ({
    
    adminMail: {
        type: [String],
        required : true,
        unique: true,
        lowerCase:true,
    },
    decryptValue: {
        type: String,
        default:null,
    },
    indice: {
        type: [String],
        default:null,
    },
    share: {
        type: [String],
        default:null,
    }
})

const DechiffrementModel = mongoose.model("dechiffrement",DechiffrementSchema)

module.exports = DechiffrementModel;