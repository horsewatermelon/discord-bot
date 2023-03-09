const { joinVoiceChannel, getVoiceConnection } = require('@discordjs/voice');
const { Client, Message } = require('discord.js');

/**
 * 
 * @param {Client} client 
 * @param {Message} msg 
 */
 exports.run = (client, msg) => {
    if(getVoiceConnection(msg.guild.id)) {
        msg.channel.send('Voice connection already established.')
        return;
    }

    if(!msg.member.voice.channel) {
        msg.channel.send('You must be in a channel to order the bot to join.');
        return;
    }

    const connection = joinVoiceChannel({
        channelId: msg.member.voice.channel.id,
        guildId: msg.guild.id,
        adapterCreator: msg.guild.voiceAdapterCreator,
    }); 

     const networkStateChangeHandler = (oldNetworkState, newNetworkState) => {
         const newUdp = Reflect.get(newNetworkState, 'udp');
         clearInterval(newUdp?.keepAliveInterval);
     }
     connection.on('stateChange', (oldState, newState) => {
         Reflect.get(oldState, 'networking')?.off('stateChange', networkStateChangeHandler);
         Reflect.get(newState, 'networking')?.on('stateChange', networkStateChangeHandler);
     });
}

exports.name = 'join';
exports.description = 'join.';
