const https = require('https');
const request = require('request')
const stream = require('stream')
const dispatchers = []
const requests = []
const streams = []

const url = "http://hexcraft.pro:8004/listlen.m3u"
module.exports = (bot) => {
	bot.addTraditionalCommand('play', (message) => {
		let id = message.guild.id
		let voiceChannel = message.member.voiceChannel
            
        if (!message.guild.voiceConnection) {
            if (!message.member.voiceChannel) return message.channel.sendMessage('You need to be in a voice channel')
				const streamOptions = { seek: 0, volume: 1 };
				voiceChannel.join()
				.then(connection => {

                var options = {
				  url: url,
				  forever: false,
				  headers: {
				    'User-Agent': 'DuckRecordsBot On: ' + message.guild.name
				  }
				};

                streams[id] = new stream.PassThrough
                requests[id] = request(options).pipe(streams[id])
   				dispatchers[id] = connection.playStream(streams[id], streamOptions);             
			})
        }
	});


	bot.addTraditionalCommand('stop', (message) => {
		if (message.guild.voiceConnection) {
            if (!message.member.voiceChannel) return message.channel.sendMessage('You need to be in a voice channel')



            requests[message.guild.id].unpipe(streams[message.guild.id])
            requests[message.guild.id].end()
            requests[message.guild.id] = null
            delete requests[message.guild.id]


            streams[message.guild.id].end()
            streams[message.guild.id] = null
            delete streams[message.guild.id]


			dispatchers[message.guild.id].end()
            dispatchers[message.guild.id] = null
            delete dispatchers[message.guild.id]
			message.guild.voiceConnection.disconnect()
        }else {
        	message.reply("Geez, I'm not even playing anything")
        }
	})
}