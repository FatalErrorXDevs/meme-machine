const Discord = require('discord.js');
const Util = require('./Util');

class MessageHandler {
    constructor(bot) {
        this.bot = bot;
    }

    handle(message) {
        message.reply('in handle loop');
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
                message.delete();
                return;
            }
            if (message.content.startsWith('!add')) {
                Util.addSounds(message.attachments, message.channel);
                message.delete();
                return;
            }
            if (message.content.startsWith('!volume')) {
                var sound = message.content.replace('!volume', '')
                sound = sound.split(" ");
                if (!isNaN(sound[2])) {
                    Util.changeSoundVolume(sound[1], sound[2], message.channel);
                } else {
                    message.reply("Thats not a valid sound level! 0-2");
                }
                return;
            }
            if (message.content.startsWith('!sounds')) {
                const sounds = Util.getSounds();
                const formattedSoundsList = sounds.map(sound => sound);
                formattedSoundsList.unshift('```');
                formattedSoundsList.push('```');
                message.author.send(formattedSoundsList);
                message.delete();
                return;
            }
            if (message.content === '!random') {
                const voiceChannel = message.member.voiceChannel;
                if (voiceChannel === undefined) {
                    message.reply('Join a voice channel first!');
                    message.delete();
                    return;
                }
                const sounds = Util.getSounds();
                const random = sounds[Math.floor(Math.random() * sounds.length)];
                this.bot.addToQueue(voiceChannel, random, message);
                if (this.bot.voiceConnections.array().length === 0) this.bot.playSoundQueue();
                message.delete();
                return;
            }
            if (message.content.startsWith('!rename ')) {
                const [oldsound, newsound] = message.content.replace('!rename ', '').split(' ');
                Util.renameSound(oldsound, newsound, message.channel);
                message.delete();
                return;
            }
            if (message.content === '!stop') {
                const voiceChannel = message.member.voiceChannel;
                this.bot.queue = [];
                voiceChannel.leave();
                message.delete();
                return;
            }
            else {
                if (message.content.startsWith('!')) {
                    const voiceChannel = message.member.voiceChannel;
                    if (voiceChannel === undefined) {
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
                        message.reply("now playing " + sound);
                        if (this.bot.voiceConnections.array().length === 0) this.bot.playSoundQueue();
                        message.delete();
                        return;
                    }
                    if (sounds.includes(sound)) {
                        this.bot.addToQueue(voiceChannel, sound, message);
                        if (this.bot.voiceConnections.array().length === 0) this.bot.playSoundQueue();
                        message.delete();
                        return;
                    }
                    message.delete();
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
