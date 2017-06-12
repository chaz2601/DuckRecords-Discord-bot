/**
 * Created by TortleWortle on 3/31/2017.
 */
// This is an example bot
const TortleBot = require('tortlebot-core')
const Discord = require("discord.js");
const client = new Discord.Client({ autoReconnect: true });
const request = require('request')
client.login('MzIzNzcxMjM4NDkxMjI2MTEy.DB_--g.Csr94aWACcKn6h-RygXfghuorTU')

const bot = new TortleBot(client)

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

bot.addTraditionalCommand('nowplaying', message => {
	request('https://quack.life/duckrecords/stats', function (error, response, body) {
		if(error) {
			message.reply("an error has occurred")
			console.error(error)
			return;
		}
		let info = JSON.parse(body)

		if(info.streams[0].bitrate == 0) {
			message.reply('Radio not live')
			return
		}
		let embed = new Discord.RichEmbed();
		embed.setColor(0x9900FF)
		embed.setTitle('DuckRecords')
		embed.addField("Now Playing: ", info.streams[0].songtitle, true)
		embed.addField("Up next: ", info.streams[0].nexttitle, true)
		embed.addField("Listeners: ", info.streams[0].currentlisteners, true)
		embed.setThumbnail("https://quack.life/duckrecords/currentart?" + getRandomInt(0, 999999))
		embed.setFooter('DuckRecords')

		message.channel.sendEmbed(embed)
	});
})

bot.addCommand("what song is currently playing", message => {
	request('https://quack.life/duckrecords/stats', function (error, response, body) {
		if(error) {
			message.reply("an error has occurred")
			console.error(error)
			return;
		}
		let info = JSON.parse(body)

		if(info.streams[0].bitrate == 0) {
			message.reply('Radio not live')
			return
		}
		let embed = new Discord.RichEmbed();
		embed.setColor(0x9900FF)
		embed.setTitle('DuckRecords')
		embed.addField("Now Playing: ", info.streams[0].songtitle, true)
		embed.addField("Up next: ", info.streams[0].nexttitle, true)
		embed.addField("Listeners: ", info.streams[0].currentlisteners, true)
		embed.setThumbnail("https://quack.life/duckrecords/currentart?" + getRandomInt(0, 999999))
		embed.setFooter('DuckRecords')

		message.channel.sendEmbed(embed)
	});
})


process.on('unhandledRejection', console.error);