const {Schema} = require('mongoose')

const MessageSchema = new Schema({
    message: {
        unique: true,
        required: true,
        type: String
    },
    reply: {
        type: Array,
        trim: true
    }
})

module.exports = MessageSchema