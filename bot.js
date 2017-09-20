/**
 * Created by TortleWortle on 3/31/2017.
 */
// This is an example bot
const TortleBot = require('tortlebot-core')
const Discord = require("discord.js");
const client = new Discord.Client({ autoReconnect: true });

client.login(process.env.BOT_TOKEN || process.argv[2])

const bot = new TortleBot(client);

bot.setPrefix(">")

bot.registerModule(require('./modules/radiostats'));
bot.registerModule(require('./modules/radioplay'));
// bot.registerModule(require('./modules/utilities'));


// bot.client.on("ready", () => {
// 	setInterval(() => {
// 		bot.setGame("Listeners: " + bot.get('voiceListeners', 0))
// 	}, 10000)
// })

// bot.addAfter(() => {})

process.on('unhandledRejection', console.error);