const TelegramBot = require('node-telegram-bot-api')
const dotenv = require('dotenv')

dotenv.config()

exports.bot = new TelegramBot(process.env.TELEGRAM_API, {
    polling: true
})