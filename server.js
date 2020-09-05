'use strict'

const http = require('http')
const port = (process.env.PORT || 8080)

require('./src')

const server = http.createServer((request, reponse) => {
    response.writeHead(200, {'content-type' : 'aplication/json'})
})