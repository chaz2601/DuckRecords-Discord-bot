const request = require('request')
const Discord = require("discord.js");
const md5 = require('md5');

module.exports = (bot) => {

	function updateGame(){
		request("https://quack.life/duckrecords/stats",
		    (err,res,body) => {
		    	if(err) {
		    		bot.setGame("Couldn't update status retrying.")
		    		return
		    	}
		        var data = JSON.parse(body);
		        bot.set('radioinfo', data);

		        if(data.streams[0].bitrate == '0') {
					bot.setGame('with the radio')
					return
				}

		        bot.setGame('Quacking: '+data.streams[0].songtitle)
			}
		)
	}

	bot.client.on('ready', () => {
		updateGame()
		setInterval(updateGame, 10 * 1000)
	})

	bot.addTraditionalCommand('nowplaying', message => {
			let info = bot.get('radioinfo')

			if(info.streams[0].bitrate == '0') {
				message.reply('Radio not live')
				return
			}
			if(info.streams[0].songtitle == null || info.streams[0].uniquelisteners == null) {
				message.reply("Not receiving enough info")
				return
			}

			let embed = new Discord.RichEmbed();
			embed.setColor(0x9900FF)
			embed.setTitle('DuckRecords')
			embed.addField("Now Playing: ", info.streams[0].songtitle)
			if(info.streams[0].nexttitle != null) {
				embed.addField("Up next: ", info.streams[0].nexttitle)
			}
			embed.addField("Unique-Listeners: ", info.streams[0].uniquelisteners)
			embed.setThumbnail("https://quack.life/duckrecords/currentart?" + md5(info.streams[0].songtitle))
			embed.setFooter('DuckRecords')

			message.channel.send({embed})
	})
}