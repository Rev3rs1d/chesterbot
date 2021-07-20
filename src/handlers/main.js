const { MessageModel } = require('../database')
const { bot } = require('../bot')
const { setTimeout } = require('timers/promises')

require('./errors.js')

async function createMessageAndAddReply(message){
    const repliedMessage = message.reply_to_message.sticker?.file_unique_id ?? message.reply_to_message.text
    const replyMessage = message.sticker?.file_id ?? message.text

    const Message = new MessageModel({
        message: repliedMessage,
        reply: replyMessage
    })

    await Message.save()
}

async function addReply(message){
    const repliedMessage = message.reply_to_message.sticker?.file_unique_id 
        ?? message.reply_to_message.text

    const exists = await MessageModel.exists({ message: repliedMessage })

    if(exists)
        return await MessageModel.findOneAndUpdate({ message: repliedMessage }, {
            $push: {
                reply: message.sticker?.file_id ?? message.text
            }
        })

    createMessageAndAddReply(message)
}

 async function answerUser(message){
     const receivedMessage = message.sticker?.file_unique_id ?? message.text
     const chatId = message.chat.id

     const sendMessageOptions = { reply_to_message_id: message.message_id }

     let exists = await MessageModel.exists({ message: receivedMessage })

     if(exists){
        const { reply } = await MessageModel.findOne({ message: receivedMessage })
        const replyToSend = reply[Math.floor(Math.random() * reply.length)]

        if(!replyToSend) return 

        const typingTime = 50 * replyToSend?.length || 6000

        await bot.sendChatAction(chatId, 'typing')
        setTimeout(typingTime).then(async () => {
            await bot.sendSticker(
                chatId,
                replyToSend,
                sendMessageOptions
            )
            .catch((error) =>
                bot.sendMessage(
                    chatId,
                    replyToSend, 
                    sendMessageOptions
                )
            )
        })
     }
}

async function main(message){
    const replyToMessage = message?.reply_to_message ?? false
    const { id: botId } = await bot.getMe()

    if(message.sticker || message.text){
        if(replyToMessage && replyToMessage.from.id != botId) addReply(message)
        if(!replyToMessage || replyToMessage.from.id == botId) answerUser(message)
    }
}

function pollingError(error){
    console.log(error)
}

exports.initHandler = () => {
    bot.on('message', main)
    bot.on('polling_error', pollingError)
}