const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()
                                                                                                                                                                              
mongoose.connect(process.env.DB_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const MessageModel = mongoose.model(
    'Reply',
    require('./models/message')
)

module.exports = { MessageModel }