const Discord = require('discord.js');
const Util = require('./Util');

class MessageHandler {
    constructor(bot) {
        this.bot = bot;
    }

    handle(message) {
        if (message.author.username !== this.bot.user.username) {
            if (message.content.startsWith('!commands')) {
                message.author.send(Util.commandsList());
                return;
            }
            if (message.content.startsWith('!remove')) {
                if (!this.checkroleCommander(message)) {
                    message.reply("You do not have permission to do that! Request Bot Commander role!");
                    return;
                }
                const sound = message.content.replace('!remove ', '');
                Util.removeSound(sound, message.channel);
                return;
            }
            if (message.content.startsWith('!add')) {
                Util.addSounds(message.attachments, message.channel);
                return;
            }
            if (message.content.startsWith('!sounds')) {
                const sounds = Util.getSounds();
                message.author.send(sounds.map(sound => sound));
                return;
            }
            if (message.content === '!random') {
                const sounds = Util.getSounds();
                const random = sounds[Math.floor(Math.random() * sounds.length)];
                const voiceChannel = message.member.voiceChannel;
                this.bot.addToQueue(voiceChannel, random, message);
                this.bot.playSoundQueue();
                return;
            }
            if (message.content === '!stop') {
                        const voiceChannel = message.member.voiceChannel;
                        voiceChannel.leave();
                        this.bot.queue = [];
                    }
            else {
                if (message.content.startsWith('!')) {
                    const voiceChannel = message.member.voiceChannel;
                    if (voiceChannel === undefined) {
                        message.reply('Join a voice channel first!');
                    }
                }
            }
        }
    }
    checkroleCommander(message) {
        let role = message.guild.roles.find("name", "Bot Commander");
        return this.hasRole(role, message)
    }
    hasRole(role, message) {
        if (message.member.roles.has(role.id)) {
            return true;
        } else {
            return false;
        }
    }
}
module.exports = MessageHandler;