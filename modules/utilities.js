module.exports = (bot) => {
	bot.addTraditionalCommand("halp", message => {
        var commands = bot.getTraditionalCommands()

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