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
                const formattedSoundsList = sounds.map(sound => sound);
                formattedSoundsList.unshift('```');
                formattedSoundsList.push('```');
                message.author.send(formattedSoundsList);
                return;
            }
            if (message.content === '!random') {
                const voiceChannel = message.member.voiceChannel;
                if (voiceChannel === undefined) {
                    message.reply('Join a voice channel first!');
                    return;
                }
                const sounds = Util.getSounds();
                const random = sounds[Math.floor(Math.random() * sounds.length)];
                this.bot.addToQueue(voiceChannel, random, message);
                if (this.bot.voiceConnections.array().length === 0) this.bot.playSoundQueue();
                return;
            }
            if (message.content === '!stop') {
                const voiceChannel = message.member.voiceChannel;
                voiceChannel.leave();
                this.bot.queue = [];
                return;
            }
            else {
                if (message.content.startsWith('!')) {
                    const voiceChannel = message.member.voiceChannel;
                    if (voiceChannel === undefined) {
                        message.reply('Join a voice channel first!');
                        return;
                    }
                    const sounds = Util.getSounds();
                    let prefixes = [];

                    prefixes = sounds.filter((sound) => sound.includes('_'));
                    prefixes = prefixes.map((prefix) => prefix.split('_')[0]);

                    const sound = message.content.split('!')[1];
                    if (prefixes.includes(sound)) {
                        let prefixlist = sounds.filter((play) => play.includes(sound + '_'));
                        let random = prefixlist[Math.floor(Math.random() * prefixlist.length)];
                        this.bot.addToQueue(voiceChannel, random, message);
                        if (this.bot.voiceConnections.array().length === 0) this.bot.playSoundQueue();
                        return;
                    }
                    if (sounds.includes(sound)) {
                        this.bot.addToQueue(voiceChannel, sound, message);
                        if (this.bot.voiceConnections.array().length === 0) this.bot.playSoundQueue();
                        return;
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