process.on('unhandledRejection', (reason, promise) => {
    console.log(`Error: %j`, reason?.message ?? reason)
})

module.exports = process