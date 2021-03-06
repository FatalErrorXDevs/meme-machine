const fs = require('fs');
const https = require('https');
const config = require('config');

const low = require('lowdb');
const fileAsync = require('lowdb/lib/storages/file-async');

class Util {
    constructor() {
        this.db = low('volume.json', { storage: fileAsync });
    }

    commandsList() {
        return [
            '```',
            '!commands              Show this message',
            '!sounds                Show available sounds',
            '!<sound>               Play the specified sound',
            '!random                Play random sound',
            '!stop                  Stop playing and clear queue',
            '!add                   Add the attached sound',
            '!rename <old> <new>    Rename specified sound',
            '!volume <sound> <level 0-2>    Adjust volume of sound between 0 and 2',
            '!remove <sound>        Remove specified sound',
            '```'
        ].join('\n');
    }

    addSounds(attachments, channel) {
        attachments.forEach(attachment => this._addSound(attachment, channel));
    }

    removeSound(sound, channel) {
        const file = `sounds/${sound}.mp3`;
        try {
            fs.unlinkSync(file);
            channel.send(`${sound} removed!`);
        } catch (error) {
            console.log(error);
            channel.send(`${sound} not found!`);
        }
    }

    renameSound(oldName, newName, channel) {
        const oldFile = `sounds/${oldName}.mp3`;
        const newFile = `sounds/${newName}.mp3`;
        try {
            fs.renameSync(oldFile, newFile);
            channel.send(`${oldName} renamed to ${newName}!`);
        } catch (error) {
            channel.send(`${oldName} not found!`);
        }
    }

    findSongInDb(sound) {
        return this.db.get('sound').find({ name: sound }).value();

    }

    changeSoundVolume(sound, volume, channel) {
        const exists = this.getSounds().includes(sound);
        if (exists) {
            var soundVolume = this.findSongInDb(sound);
            console.log(soundVolume);
            if (soundVolume) {
                this.db.get('sound').find({ name: sound }).value().volume = volume;
                this.db.write();
                channel.send(sound + " volume changed to " + volume)
                return;
            } else {
                this.db.get('sound').push({
                    name: sound, volume: Number(volume)
                }).write();
                channel.send(sound + " volume changed to " + volume)
                return;
            }
        } else {
            channel.send('that sound doesnt exists!');
            return;
        }
    }

    findSoundVolume(sound) {
        return this.findSongInDb(sound).volume;
    }

    getExtensionForSound(name) {
        return this.getSoundsWithExtension().find(sound => sound.name === name).extension;
    }

    getPathForSound(sound) {
        return `sounds/${sound}.${this.getExtensionForSound(sound)}`;
    }

    getSoundsWithExtension() {
        const files = fs.readdirSync('sounds/');
        let sounds = files.filter(sound => config.get('extensions').some(ext => sound.endsWith(ext)));
        sounds = sounds.map(sound => ({ name: sound.split('.')[0], extension: sound.split('.')[1] }));
        return sounds;
    }

    getSounds() {
        const sounds = this.getSoundsWithExtension();
        return sounds.map(sound => sound.name);
    }

    _addSound(attachment, channel) {
        if (attachment.filesize > config.get('size')) {
            channel.send(`${attachment.filename.split('.')[0]} is too big!`);
            return;
        }

        if (!config.get('extensions').some(ext => attachment.filename.endsWith(ext))) {
            channel.send('Sound has to be in accepted format!');
            return;
        }

        const filename = attachment.filename.split('.')[0];
        if (this.getSounds().includes(filename)) {
            channel.send(`${filename} already exists!`);
            return;
        }

        https.get(attachment.url, (response) => {
            if (response.statusCode === 200) {
                const file = fs.createWriteStream(`./sounds/${attachment.filename}`);
                response.pipe(file);
                channel.send(`${filename} added!`);
            }
        }).on('error', (error) => {
            console.error(error);
            channel.send('Something went wrong!');
        });
    }
}
module.exports = new Util();
