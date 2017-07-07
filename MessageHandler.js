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
                if(!this.checkroleCommander(message)){
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
            else {
                if (message.content.startsWith('!')) {
                    message.reply("not implemented playing sounds");
                    return;
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