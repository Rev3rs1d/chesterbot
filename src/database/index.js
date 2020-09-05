'use strict'

const mongoose = require('mongoose')

mongoose.connect(process.env.DB_STRING, {useNewUrlParser: true, useUnifiedTopology: true}) //substitua "process.env.DB_STRING" pela string de conexão de seu MongoDb

exports.message = mongoose.model('Reply', require('./models/message'))