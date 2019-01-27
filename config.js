const fs = require('fs');
const crypto = require('crypto');

module.exports = class Config {
    
    /**
     * Creates an account for name with the password
     * @param {*} name 
     * @param {*} password 
     */
    static createAccount(name, password) {
        var account = {
            name: null,
            characters: [],
            password: null,
            banned: false,
        }
        account.name = name;
        account.password = crypto.createHash('md5').update(password).digest("hex");
        var accountJSON = JSON.stringify(account, null, 4);
        fs.writeFileSync(`./data/accounts/${name}.json`, accountJSON, 'utf8');
    }

    /**
     * Creates a new character for the user
     * @param {string} user 
     * @param {string} charName 
     * @param {string} charRace 
     * @param {string} charClass 
     */
    static createCharacter(user, charName, charRace, charClass) {
        //Push character to the user account
        var data = fs.readFileSync(`./data/accounts/${user}.json`, 'utf8');
        data = JSON.parse(data);
        data.characters.push(
            {
                name: charName
            }
        );
        var charJSON = JSON.stringify(data, null, 4);
        fs.writeFileSync(`./data/accounts/${user}.json`, charJSON, 'utf8');
        //Layout
        var character = {
            name: charName,
            race: charRace,
            class: charClass,
            attributes: {
                health: {
                    mod: 0,
                    base: 0
                },
                mana: {
                    mod: 0,
                    base: 0
                },
                strength: {
                    mod: 0,
                    base: 0
                },
                agility: {
                    mod: 0,
                    base: 0
                },
                intellect: {
                    mod: 0,
                    base: 0
                },
                wisdom: {
                    mod: 0,
                    base: 0
                },
                armor: {
                    mod: 0,
                    base: 0
                }
            },
            level: 1,
            xp: 0,
            map: '',
            pos: {
                x: 0,
                y: 0
            },
            inventory: {
                items: [],
                max: 8
            },
            equipment: {},
            quests: {
                active: [],
                completed: []
            },
            banned: false,
        };
        //Check race
        if (charRace == 'Human') {
            //Human starting location
            character.map = 'Northshire';
            character.pos = {
                x: 3,
                y: 3
            }
        }
        var charJSON = JSON.stringify(character, null, 4);
        fs.writeFileSync(`./data/characters/${charName}.json`, charJSON, 'utf8');
        return character;
    }

    /**
     * Compares the password from the login with the one in the storage
     * @param {string} name 
     * @param {string} pass 
     */
    static compPassword(name, pass) {
        var data = fs.readFileSync(`./data/accounts/${name}.json`, 'utf8');
        data = JSON.parse(data);
        var passHash = crypto.createHash('md5').update(pass).digest("hex");
        if (passHash == data.password) return true;
        return false;
    }

    /**
     * Checks if an account with this name already exists
     * @param {string} name 
     */
    static checkAccount(name) {
        if (fs.existsSync('./data/accounts/'+name+'.json')) {
            return true;
        } 
        return false;
    }

    /**
     * Returns the account data belonging to the account name
     * @param {string} name 
     */
    static getAccount(name) {
        var data = fs.readFileSync(`./data/accounts/${name}.json`, 'utf8');
        data = JSON.parse(data);
        return data;
    }

    /**
     * Loads all characters of the account specified by name from the storage
     * @param {string} name 
     */
    static getCharacters(name) {
        var chars = [];
        var data = fs.readFileSync(`./data/accounts/${name}.json`, 'utf8');
        data = JSON.parse(data);
        for (var i = 0; i < data.characters.length; i++) {
            var charName = data.characters[i].name;
            var char = fs.readFileSync(`./data/characters/${charName}.json`, 'utf8');
            chars.push(JSON.parse(char));
        }
        return chars;
    }

    /**
     * Compares the attribute of the command and checks if it finds a fitting entity 
     * @param {string} command 
     * @param {string} entity 
     */
    static compCommand(command, entity) {
        var args = command.toLowerCase();
        var name = entity.split(' ');
        for (var i = 0; i < name.length; i++) {
            if (args.includes(name[i].toLowerCase())) {
                return true;
            }
        }
        return false;
    }

    /**
     * Saves the character to the character file
     * @param {object} char 
     */
    static saveCharacter(char) {
        var charJSON = JSON.stringify(char, null, 4);
        fs.writeFileSync(`./data/characters/${char.name}.json`, charJSON, 'utf8');
    }

    /**
     * Filters the text for color tags and replaces them with the correct color codes
     * @param {string} text 
     */
    static color(text) {
        if (text.includes('<red>') && text.includes('</red>')) {
            text = text.replace("<red>", "\x1B[31m");
            text = text.replace("</red>", "\x1B[0m");
        }
        if (text.includes('<green>') && text.includes('</green>')) {
            text = text.replace("<green>", "\x1B[32m");
            text = text.replace("</green>", "\x1B[0m");
        }
        if (text.includes('<yellow>') && text.includes('</yellow>')) {
            text = text.replace("<yellow>", "\x1B[33m");
            text = text.replace("</yellow>", "\x1B[0m");
        }
        if (text.includes('<blue>') && text.includes('</blue>')) {
            text = text.replace("<blue>", "\x1B[34m");
            text = text.replace("</blue>", "\x1B[0m");
        }
        if (text.includes('<magenta>') && text.includes('</magenta>')) {
            text = text.replace("<magenta>", "\x1B[35;1m");
            text = text.replace("</magenta>", "\x1B[0m");
        }
        if (text.includes('<cyan>') && text.includes('</cyan>')) {
            text = text.replace("<cyan>", "\x1B[36;1m");
            text = text.replace("</cyan>", "\x1B[0m");
        }
        return text;
    }

    /**
     * Sends a broadcast message to every player on the server
     * @param {object} sender 
     * @param {string} message 
     */
    static sendBroadcast(sender, message) {
        for (var i = 0; i < players.length; i++) {
            if (players[i].character.name != sender) {
                players[i].socket.write(this.color(`<green>${sender} said:</green>`) + message);
            } else {
                players[i].socket.write(this.color(`<green>You said:</green>`) + message);
            }
        }
    }

    /**
     * Sends a private message to the player specified in message
     * @param {object} sender 
     * @param {string} message 
     */
    static sendPrivateMessage(sender, message) {
        var messageTo = message[0];
        //Remove the reciever from the message
        message.splice(0,1);
        message = message.join(" ");
        var found = false;
        for (var i = 0; i < players.length; i++) {
            if (players[i].character.name.toLowerCase() == messageTo.toLowerCase()) {
                found = true;
                players[i].socket.write(this.color(`<cyan>${sender.name} whispers in your ear:</cyan> `) + message);
            }
        }
    }

    /**
     * Sends a message to all players in the zone of the sender
     * @param {object} sender 
     * @param {string} message 
     */
    static sendZoneMessage(sender, message) {
        //Get sender Map and Zone
        var map = sender.map;
        var pos = sender.pos;
        for (var i = 0; i < players.length; i++) {
            if (players[i].character.name != sender.name) {
                if (map == players[i].character.map && pos.x == players[i].character.pos.x && pos.y == players[i].character.pos.y) {
                    players[i].socket.write(this.color(`<green>${sender.name} said:</green>`) + message);
                }
            } else {
                players[i].socket.write(this.color(`<green>You said:</green>`) + message);
            }
        }
    }
}