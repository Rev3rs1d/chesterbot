const TelegramBot = require('node-telegram-bot-api')


exports.bot = new TelegramBot(process.env.TELEGRAM_API, {polling: true})