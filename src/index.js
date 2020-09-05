'use strict'

//removendo "deprecated Automatic..."
require('dotenv').config()

//constantes globais
const TelegramBot = require('node-telegram-bot-api')
const bot = new TelegramBot(process.env.TELEGRAM_API, {polling: true}) //substitua "process.env.TELEGRAM_API" pelo token de seu bot
const Message = require('./database').message

//função axuliar
const createMessageAndAddReply = async (message, type) => {
    const newMessage = new Message()
    var userMessage = type == 'sticker' ? message.reply_to_message.sticker.file_unique_id : message.reply_to_message.text
    var reply = message.sticker ? message.sticker.file_id : message.text, save

try {
    newMessage.message = userMessage
    newMessage.reply = reply
    save =  await newMessage.save()
} catch(error){
    console.log(error.message)
}
}

//funções principais
const addReply = async (message) => {
var userMessage, type

    if(message.reply_to_message.sticker){
        userMessage = message.reply_to_message.sticker.file_unique_id
        type = 'sticker'
    } else {
        userMessage = message.reply_to_message.text
        type = 'text'
    }

    if(await Message.exists({message: userMessage})){

    let savedMessage = await Message.findOne({message: userMessage})
    let replys = savedMessage.reply

    if(message.sticker)
        replys.push(message.sticker.file_id)
    else
        replys.push(message.text)

    try {
        let updateMessage = await Message.findOneAndUpdate({message: userMessage}, {reply: replys})
    } catch(error){
        console.log(error.message)
    }

} else {
    createMessageAndAddReply(message, type)
}
}

const answerUser = async (message, type) => {
    var userMessage = message.sticker ? message.sticker.file_unique_id : message.text
    const chatId = message.chat.id

    const options = {
        reply_to_message_id: message.message_id
    }

    if(await Message.exists({message: userMessage})){
        let reply = await Message.findOne({message: userMessage})
        reply = reply.reply
        reply = reply[Math.floor(Math.random() * reply.length)]

        try {
            let isSend = await bot.sendSticker(chatId, reply, options)
        } catch(error){
            //usando o erro ao meu favor ;)
            bot.sendMessage(chatId, reply, options)
        }
    }
}

const main = async (message) => {
    const reply_to_message = message.reply_to_message
    const botDetails = await bot.getMe()
    const botId = botDetails.id
    
    if(reply_to_message && reply_to_message.from.id != botId)
        if(reply_to_message.sticker || reply_to_message.text)
            addReply(message)

    if(!reply_to_message || reply_to_message.from.id == botId)
        answerUser(message)

}

//chamada de todas as funções
bot.on('message', main)

//tratamento de erros
bot.on('polling_error', (error) => console.log(error))