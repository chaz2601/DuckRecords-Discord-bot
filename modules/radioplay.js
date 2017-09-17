const https = require('https');
const request = require('request')
const stream = require('stream')
const ytdl = require('ytdl-core')
const dispatchers = []
const connections = []
const streams = []



var options = {
  url: "http://streaming.radionomy.com/UBGRadio",
  headers: {
    'User-Agent': 'DuckRecordsBot'
  }
};

const streamOptions = { seek: 0, volume: 1 };




module.exports = (bot) => {

	const broadcast = bot.client.createVoiceBroadcast();

	function getStream() {
		var radiostreamreq = request(options)
		broadcast.playStream(radiostreamreq)

		for (const connection of bot.client.voiceConnections.values()) {
		  connection.playBroadcast(broadcast);
		}

		radiostreamreq.on('error', (error) => {
			console.error(error)
			console.error('Retrying in 2 seconds')
			setTimeout(getStream, 2000)
		})
		radiostreamreq.on('end', () => {
			console.error('Connection ended retrying in 2 seconds.')
			setTimeout(getStream, 2000)
		})
		radiostreamreq.on('abort', () => {
			console.error('Connection aborted retrying in 2 seconds.')
			setTimeout(getStream, 2000)
		})	
	}

	bot.client.on('ready', () => {

		getStream()


		setInterval(()=> {
			let listeners = 0;
			for (const connection of bot.client.voiceConnections.values()) {
				//not sure how javascript handles this so better safe than sorry
				if(connection.channel.members.keyArray().length == 1) {
					connection.disconnect()
				}else {
					//subtract the bot
					listeners += connection.channel.members.keyArray().length -1
				}
			}
			bot.set('voiceListeners', listeners)
		}, 5 * 1000)
	})

	bot.addCommand('play( *site/watch?v=:video)', (payload) => {
		let message = payload.message
		let id = message.guild.id
		var video = payload.params.video
		var site = payload.params.site
		console.log(payload.params)

		if(site != null && video != null) {
			if(site.includes("youtube.com") || site.includes("youtu.be") || true) {
				var voice = getVoiceConnection(message)
				if(voice != null) {
					voice.then(connection => {
						message.guild.id
						streams[message.guild.id] = ytdl("https://www.youtube.com/watch?v=" + video)
			        	connection.playStream(streams[message.guild.id])

			        	streams[message.guild.id].on("end", () => {
			        		streams[message.guild.id] = null
			        		connection.playBroadcast(broadcast)
			        	})

			        	streams[message.guild.id].on("error", (error) => {
			        		streams[message.guild.id] = null
			        		message.reply(error.message)
			        		connection.playBroadcast(broadcast)
			        	})
			        })
		        }
			}
		}else {
			console.log("playing normal")
			var voice = getVoiceConnection(message)
			if(voice != null) {
				if(streams[message.guild.id] != null) {
					streams[message.guild.id].destroy()
				}
				voice.then(connection => {
					console.log("playing broadcast")
		        	setTimeout(() => {
		        		connection.playBroadcast(broadcast)
		        	}, 300)
		        })
	        }
		}
            

	});

	function getVoiceConnection(message) {
		let voiceChannel = message.member.voiceChannel
        if (!message.member.voiceChannel) return message.channel.sendMessage('You need to be in a voice channel')
		return voiceChannel.join()
	}

	bot.addCommand('stop', (payload) => {
		var message = payload.message
		if (message.guild.voiceConnection) {
            if (!message.member.voiceChannel) return message.channel.sendMessage('You need to be in a voice channel')
            	message.guild.voiceConnection.disconnect()

        }else {
        	message.reply("Geez, I'm not even playing anything")
        }
	})
}