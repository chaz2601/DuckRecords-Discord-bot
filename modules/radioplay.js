const https = require('https');
const request = require('request')
const stream = require('stream')
const dispatchers = []
const connections = []



var options = {
  url: "https://quack.life/duckrecords/listen.m3u",
  forever: false,
  timeout: 5*1000,
  headers: {
    'User-Agent': 'DuckRecordsBot'
  }
};

let radiostream = new stream.PassThrough;
var radiostreamreq

function getStream() {
	radiostreamreq = request(options)
	radiostreamreq.pipe(radiostream)
}
getStream()
radiostreamreq.on('error', (error) => {
	console.error(error)
	console.error('Retrying in 2 seconds')
	setTimeout(getStream, 2000)
})



module.exports = (bot) => {

	bot.client.on('ready', () => {
		setInterval(()=> {

			for (key in connections) {
				//not sure how javascript handles this so better safe than sorry
				if(connections[key].channel.members.keyArray().length == 1) {
					disconnectVoice(key)
				}
			}
		}, 5 * 1000)
	})

	bot.addTraditionalCommand('play', (message) => {
		let id = message.guild.id
		let voiceChannel = message.member.voiceChannel
            
        if (!message.guild.voiceConnection) {
            if (!message.member.voiceChannel) return message.channel.sendMessage('You need to be in a voice channel')
				const streamOptions = { seek: 0, volume: 1 };
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
			connections[id].dispatcher.end()
			connections[id].disconnect()
            connections[id] = null
            delete connections[id]
	}
}