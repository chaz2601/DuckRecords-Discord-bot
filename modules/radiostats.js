const request = require('request')
const Discord = require("discord.js");
const md5 = require('md5');

module.exports = (bot) => {

	function updateGame(){
		request("http://chisdealhd.xyz/radio/np.php",
		    (err,res,body) => {
		    	if(err) {
		    		bot.setGame("Couldn't update status retrying.")
		    		return
		    	}
		        var data = JSON.parse(body);
		        // console.log(data)
		        bot.set('radioinfo', data);

		        if(data.track.title == null) {
					bot.setGame('with the radio')
					return
				}
				var song = data.track.title + " - " + data.track.artists

				var listeners = bot.get('voiceListeners', 0)

				if(listeners == null) {
					listeners = 0
				}

		        bot.setGame('Quacking '+ song + " to " + listeners + " old ladies.")
			}
		)
	}

	bot.client.on('ready', () => {
		updateGame()
		setInterval(updateGame, 10 * 1000)
	})

	bot.addCommand('nowplaying', payload => {
		var message = payload.message
		let info = bot.get('radioinfo')

		if(info.track.title == null) {
			message.reply('Radio not live')
			return
		}

		let embed = new Discord.RichEmbed();
		embed.setColor(0x9900FF)
		embed.setTitle('QuackRecords')
		embed.addField("Now Playing: ", info.track.title + " - " + info.track.artists)

		var listeners = bot.get('voiceListeners', 0)

		if(listeners == null) {
			listeners = 0
		}

		embed.addField("Listeners: ", listeners)
		embed.setThumbnail(info.track.cover)
		embed.setFooter('QuackRecords')
		embed.setURL('https://unitedbygames.net/community/')

		message.channel.send({embed})
	})
}