const Discord = require('discord.js');

class MessageHandler {
    constructor(bot) {
        this.bot = bot;
    }

    handle(message) {
        if (message.author.username !== this.bot.user.username) {
            if(message.content.startsWith('!add')){
                message.reply("not implemented? " + message.content);
            }
            if(message.content.startsWith('!remove')){
                message.reply("not implemented? " + message.content);
            }
            if(message.content.startsWith('!commands')){
                message.reply("not implemented? " + message.content);
            }
            else{
                if(message.content.startsWith('!')){
                    message.reply("not implemented playing sounds");
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