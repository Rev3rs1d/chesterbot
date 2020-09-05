'use strict'

const mongoose = require('mongoose')

const Schema = mongoose.Schema
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