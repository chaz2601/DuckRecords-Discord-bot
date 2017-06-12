const request = require('request')
const Discord = require("discord.js");

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

module.exports = (bot) => {
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

		});
	})
}
