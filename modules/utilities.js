module.exports = (bot) => {
	bot.addCommand("halp", payload => {
        var message = payload.message
        var commands = bot.getCommands()

        if(commands.length) {
            var replyMsg = "U in need, I halp! \`\`\`"

            for (var i = 0; i < commands.length; i++) {
                replyMsg += bot.getPrefix() + commands[i].index + "\n"
            }

            replyMsg += "\`\`\`"
            message.reply(replyMsg)
        }
    })
}