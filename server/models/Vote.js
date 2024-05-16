const mongoose = require("mongoose")

const VoteSchema = new mongoose.Schema ({
    
    clePub: {
        type: [String],
        required : true,
    },
    prime: {
        type: String,
        required : true,
    },
    dateEnd: {
        type: Date,
        required : true,
        validate: {
            validator: function (date) {
                return date > new Date();
            },
            message: "La date de fin doit être ultérieure à la date actuelle",
        },
    },
    dateDisplay: {
        type: Date,
        required : true,
        validate: {
            validator: function (date) {
                return date > new Date();
            },
            message: "La date d'affichage doit être ultérieure à la date actuelle",
        },
    },
    votes : {
        type: [String],
        default : []
    }
})

const VoteModel = mongoose.model("votes",VoteSchema)

module.exports = VoteModel;