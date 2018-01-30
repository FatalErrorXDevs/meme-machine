const Discord = require('discord.js');
var bot = new Discord.Client({ autoReconnect: true });
const Config = require('config')
const MessageHandler = require('./MessageHandler.js');
const low = require('lowdb');
const fileAsync = require('lowdb/lib/storages/file-async');
var Util = require('./Util')


class SoundBot extends Discord.Client {
    constructor() {
        super();
        this.messageHandler = new MessageHandler(this);
        this.login(Config.get('token'));
        this._addEventListeners();
        this.db = low('volume.json', { storage: fileAsync });
        this.db.defaults({ sound: [] }).write();
        this.queue = [];
        this.util = Util;
    }

    _addEventListeners() {
        this.on('message', this._messageListener);
    }

    addToQueue(voiceChannel, sound, messageTrigger) {
        this.queue.push({ name: sound, channel: voiceChannel.id, message: messageTrigger });
    }

    addToQueueFromGUI(voiceChannel, sound){
        this.queue.push({name: sound, channel: voiceChannel, message: null});
    }


    playSoundQueue() {
        const nextSound = this.queue.shift();
        const file = Util.getPathForSound(nextSound.name);
        const voiceChannel = this.channels.get(nextSound.channel);
        var soundVolume = Util.findSongInDb(nextSound.name);

        if(soundVolume){
            var soundVolume =  Util.findSongInDb(nextSound.name)
            soundVolume = (soundVolume.volume);
            console.log("volume changed from db") ;   
        } else {
            soundVolume = 1;
        }


        voiceChannel.join().then((connection) => {
            const dispatcher = connection.playFile(file, { volume: Number(soundVolume) } );
            dispatcher.on('end', () => {
                if (Config.get('deleteMessages') === true)
                    if(nextSound.message != null ){
                    nextSound.message.delete();}

                if (this.queue.length > 0)
                    this.playSoundQueue();
                else
                    connection.disconnect();
            });
        }).catch((error) => {
            console.log('Error occured!');
            console.log(error);
        });
    }

    awnser(message){
        message.reply("REEEE");
    }


    containsMe(array){

        var found = false;
        for(var i = 0; i < array.length; i++) {
            if (array[i].id == this.user.id) {
                found = true;
                return true
                break;
            }

    }
    return false;
}

    _messageListener(message) {
        if (message.channel instanceof Discord.DMChannel) return; // Abort when DM
        if (!message.content.startsWith('!') && this.user.id != message.author.id && this.containsMe(message.mentions.users.array())) this.awnser(message); // Abort when not prefix
        this.messageHandler.handle(message);
    }
}
module.exports = new SoundBot();