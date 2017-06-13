const https = require('https');
const request = require('request')
const stream = require('stream')
const dispatchers = []
const connections = []



var options = {
  url: "https://quack.life/duckrecords/listen.m3u",
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

	bot.addTraditionalCommand('play', (message) => {
		let id = message.guild.id
		let voiceChannel = message.member.voiceChannel
            
        if (!message.guild.voiceConnection) {
            if (!message.member.voiceChannel) return message.channel.sendMessage('You need to be in a voice channel')
				voiceChannel.join()
				.then(connection => {
				connections[id] = connection
   				connection.playBroadcast(broadcast)            
			})
        }
	});


	bot.addTraditionalCommand('stop', (message) => {
		if (message.guild.voiceConnection) {
            if (!message.member.voiceChannel) return message.channel.sendMessage('You need to be in a voice channel')
            	disconnectVoice(message.guild.id)

        }else {
        	message.reply("Geez, I'm not even playing anything")
        }
	})

	function disconnectVoice(id) {
		if(connections[id] != null) {
			if(connections[id].dispatcher != null) {
				connections[id].dispatcher.end()
			}
			connections[id].disconnect()
            connections[id] = null
            delete connections[id]
        }
	}
}