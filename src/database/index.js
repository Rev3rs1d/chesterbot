const mongoose = require('mongoose')
const dotenv = require('dotenv')
const MessageSchema = require("./models/message");

dotenv.config()

mongoose.connect(process.env.DB_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const MessageModel = mongoose.model('Reply', MessageSchema)

module.exports = {MessageModel}