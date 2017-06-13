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

var radiostream
var radiostreamreq

function getStream() {
	radiostream = new stream.PassThrough;
	radiostreamreq = request(options)
	radiostreamreq.pipe(radiostream)

	for(key in connections) {
		connections[key].playStream(radiostream, streamOptions)
	}

	radiostreamreq.on('error', (error) => {
		console.error(error)
		console.error('Retrying in 2 seconds')
		setTimeout(getStream, 2000)
	})
}
getStream()



module.exports = (bot) => {

	bot.client.on('ready', () => {
		setInterval(()=> {
			let listeners = 0;
			for (key in connections) {
				//not sure how javascript handles this so better safe than sorry
				if(connections[key].channel.members.keyArray().length == 1) {
					disconnectVoice(key)
				}else {
					//subtract the bot
					listeners += connections[key].channel.members.keyArray().length -1
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
   				connection.playStream(radiostream, streamOptions);             
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