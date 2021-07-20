const { Schema } = require('mongoose')

const schema = new Schema({
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
		
module.exports = schema