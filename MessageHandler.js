const Discord = require('discord.js');
const Util = require('./Util');

class MessageHandler {
    constructor(bot) {
        this.bot = bot;
    }

    handle(message) {
        if (message.author.username !== this.bot.user.username) {
            if(message.content.startsWith('!commands')){
                message.author.send(Util.commandsList());
                return;
            }
            if(message.content.startsWith('!remove')){
                message.reply("not implemented? " + message.content);
                return;
            }
            if(message.content.startsWith('!add')){
                Util.addSounds(message.attachments, message.channel);
                return;
            }
            else{
                if(message.content.startsWith('!')){
                    message.reply("not implemented playing sounds");
                    return;
                }
            }
        }
    }
    checkroleCommander(message) {
        let role = message.guild.roles.find("name", "Bot Commander");
        return this.hasRole(role,message)
    }
    hasRole(role,message) {
        if (message.member.roles.has(role.id)) {
            return true;
        } else {
            return false;
        }
    }
}
module.exports = MessageHandler;