const Map = require('./maps');
const Config = require('./config');
const Player = require('./player');
const EventHandler = require('./eventHandler');

//Actions importieren
const WhoAction = require('./actions/who_action');
const DebugAction = require('./actions/debug_action');
const MapAction = require('./actions/map_action');
const LogoutAction = require('./actions/logout_action');

module.exports = class CommandHandler {
    constructor(socket) {
        this.account = {};
        this.character = {};
        this.handler = new EventHandler();
        this.player;
        this.socket = socket;
        this.state = 'startup';
        this.map = null;
        this.zone = null;
        this.step = 0;
        this.actionStack = [];
    }

    checkCommand(command) {
        //Startup process
        if (this.state == 'startup') {
            if (command.toLowerCase() == "l" || command.toLowerCase() == "login") {
                this.print('Please type in your existing Account name.');
                this.print('\r\n\r\nAccount:');
                this.state = 'login';
            } else if (command.toLowerCase() == "r" || command.toLowerCase() == "register") {
                this.print('We are happy to have you as a new player. Please answer the following questions to get started.');
                this.print('\r\nWhat is your account name?');
                this.print('\r\n\r\nAccount:');
                this.state = 'register';
            } else {
                this.print('\r\nWrong command');
            }
        }
        //Login process
        else if (this.state == 'login') {
            if (this.step == 0) {
                if (command.toLowerCase() == "n" || command.toLowerCase() == "new") {
                    this.print('We are happy to have you as a new player. Please answer the following questions to get started.');
                    this.print('What is your account name?');
                    this.print('\r\n\r\nAccount:');
                    this.state = 'register';
                } if (Config.checkAccount(command)) {
                    this.account.name = command;
                    this.print('What is your password? ');
                    this.print('\r\n\r\nPassword:');
                    this.step++;
                } else {
                    this.print('This account does not exist.');
                    this.print('\r\nYou can either try again or type in (N)ew to create a new account.');
                    this.print('\r\n\r\nAccount:');
                }
            } else if (this.step == 1) {
                if (Config.compPassword(this.account.name, command)) {
                    this.account = Config.getAccount(this.account.name);
                    this.print('Welcome ' + this.account.name + '!');
                    this.print('\r\nPress <enter> to go to the Character Select screen.');
                    this.step = 0;
                    this.state = 'charSelection';
                } else {
                    this.print('This password is not correct, please try again.');
                    this.print('\r\n\r\nPassword:');
                }
            }
        }
        //Register process
        else if (this.state === 'register') {
            if (this.step == 0) {
                if (Config.checkAccount(command)) {
                    this.print('This account already exists. Please try again.');
                    this.print('\r\n\r\nAccount:');
                } else {
                    this.account.name = command;
                    this.print('Please choose a password.')
                    this.print('\r\n\r\nPassword:')
                    this.step++;
                }
            } else if (this.step == 1) {
                this.account.pass = command;
                this.print('Please repeat your password.')
                this.print('\r\n\r\nPassword:')
                this.step++;
            } else if (this.step == 2) {
                if (this.account.pass == command) {
                    Config.createAccount(this.account.name, this.account.pass);
                    this.account = Config.getAccount(this.account.name);
                    this.print('Welcome ' + this.account.name + '!');
                    this.print('\r\nCongratulations, your account has been created.');
                    this.print('\r\nYour next step is to create a character to start your journey.');
                    this.print('\r\nPress <enter> to go to the Character Select screen.');
                    this.state = 'charSelection';
                    this.step = 0;
                } else {
                    this.print('Your passwords do not match, please try again.');
                }
            }
        }
        //Character Selection
        else if (this.state == 'charSelection') {
            //Split command to get the arguments
            command = command.split(' ');
            //Start playing
            if (command[0].toLowerCase() == "p" || command[0].toLowerCase() == "play") {
                if (command.length == 2) {
                    for (var i = 0; i < Config.getCharacters(this.account.name).length; i++) {
                        var char = Config.getCharacters(this.account.name)[i];
                        if (Config.compCommand(command[1], char.name)) {
                            this.character = char;
                            this.player = new Player(this.account, this.character, this.socket);
                            players.push(this.player);
                            this.map = new Map(char.map);
                            this.map.createMap();
                            this.zone = this.map.getZone(char.pos.x, char.pos.y);
                            this.printZoneInfo();
                            this.state = 'game';
                        }
                    }
                }
            } 
            else if (command[0].toLowerCase() == "n" || command[0].toLowerCase() == "new") {
                this.print('Please choose a name for you character.');
                this.print('\r\n\r\nName:');
                this.state="characterCreation";
            }
            else if (command[0].toLowerCase() == "d" || command[0].toLowerCase() == "delete") {

            }
            else if (command[0].toLowerCase() == "l" || command[0].toLowerCase() == "logout") {
                this.socket.end();
            }
            else if (Config.getCharacters(this.account.name).length == 0) {
                this.print('\r\n===========================================');
                this.print("\r\n|     You don't have any characters yet   |");
                this.print('\r\n===========================================');
                this.print("\r\n| Available commands:                     |");
                this.print("\r\n| (P)lay <char> => Start playing          |");
                this.print("\r\n| (N)ew => Create a new character         |");
                this.print("\r\n| (D)delete <char> => Deletes a character |");
                this.print("\r\n| (L)ogout => Logs you out                |");
                this.print('\r\n===========================================\r\n');
            } else {
                this.print('\r\n===========================================');
                for (var i = 0; i < Config.getCharacters(this.account.name).length; i++) {
                    this.print(`\r\nName: ${Config.getCharacters(this.account.name)[i].name} | `);
                    this.print(`Class: ${Config.getCharacters(this.account.name)[i].class} | `);
                    this.print(`Level: ${Config.getCharacters(this.account.name)[i].level}`);
                }
                this.print('\r\n===========================================');
                this.print("\r\n| Available commands:                     |");
                this.print("\r\n| (P)lay <char> => Start playing          |");
                this.print("\r\n| (N)ew => Create a new character         |");
                this.print("\r\n| (D)delete <char> => Deletes a character |");
                this.print("\r\n| (L)ogout => Logs you out                |");
                this.print('\r\n===========================================\r\n');
            }
        }
        //Character creation
        else if (this.state == 'characterCreation') {
            if (this.step == 0) {
                this.character.name = command;
                this.print('The Misthaven MUD houses a wide variety of races, please choose carefully.');
                this.print('\r\nTo get more information about the different races enter: info <number>');
                this.print('\r\nThere are the following races, to choose one simply enter the corresponding number:');
                this.print('\r\n1) Human');
                this.print('\r\n2) Dwarf');
                this.print('\r\n3) Giant');
                this.print('\r\n4) Troll\r\n');
                this.step++;
            } else if (this.step == 1) {
                this.character.race = 'Human';
                this.print(`You choosed the ${this.character.race} race.`); 
                this.print('\r\nPlease choose your class now. Just like before you can use the info command to gain further information about the class');
                this.print('\r\n1) Warrior');
                this.print('\r\n2) Runecaster');
                this.print('\r\n3) Thief');
                this.print('\r\n4) Bard\r\n');
                this.step++;
            } else if (this.step == 2) {
                if (command == '1') {
                    this.character.class = 'Warrior';
                }
                this.character = Config.createCharacter(this.account.name, this.character.name, this.character.race, this.character.class);
                this.print('You choosed ' + this.character.name + ' as your character name.');
                this.print('\r\nYou choosed ' + this.character.race + ' as your race.');
                this.print('\r\nYou choosed ' + this.character.class + ' as your class.');
                this.print('\r\nPlease hit <enter> to return to the character selection');
                this.state = 'charSelection';
                this.step = 0;
            }
        }
        //Game state
        else if (this.state == 'game') {;
            //Split the commands to get the arguments
            var command = command.split(' ');
            //Talk command
            if (command[0].toLowerCase() == 'talk' && command.length > 1 && command.length <= 2) {
                if (Config.compCommand(command[1], this.zone.npcs[0].name)) {
                    this.print('\r\n'+this.zone.npcs[0].text);
                }
            } else if (command[0].toLowerCase() == 'talk' && command.length > 2) {
                this.print('\r\nIncorrect usage of the talk command.');
                this.print('\r\nCorrect syntax: talk <npc name>');
            }
            //Look command 
            if (command[0].toLowerCase() == 'look'  && command.length <= 2) {
                //Look at the current zone
                if (command.length == 1) {
                    this.printZoneInfo();
                }
                //Look at something else 
                else if (command.length == 2) {
                    //TODO: implement for NPCs, items, enemies, objects
                }
            }
            //Save command
            if (command[0].toLowerCase() == 'save') {
                this.print('Saving character...');
                Config.saveCharacter(this.character);
            }
            //Map command
            if (command[0].toLowerCase() == "m" || command[0].toLowerCase() == "map") {
                this.actionStack.push(new MapAction(this, []));
            }
            //Movement commands
            //North
            if (command[0].toLowerCase() == "n" || command[0].toLowerCase() == "north") {
                if (this.map.getZone(this.character.pos.x, this.character.pos.y-1) == false) {
                    this.print('You can not go this way!\r\n');
                } else {
                    this.handler.emit('zoneLeftEvent', {char: this.character, dir: "North"});
                    this.zone = this.map.getZone(this.character.pos.x, this.character.pos.y-1);
                    if (this.zone.level !== undefined) {
                        this.map = new Map(this.zone.level);
                        this.map.createMap();
                    }
                    this.character.pos.x = this.zone.pos.x;
                    this.character.pos.y = this.zone.pos.y;
                    this.handler.emit('zoneEnterEvent', {char: this.character});
                    this.character.map = this.map.name;
                    this.printZoneInfo();
                }
            } 
            //East
            else if (command[0].toLowerCase() == "e" || command[0].toLowerCase() == "east") {
                if (this.map.getZone(this.character.pos.x+1, this.character.pos.y) == false) {
                    this.print('You can not go this way!\r\n');
                } else {
                    this.handler.emit('zoneLeftEvent', {char: this.character, dir: "East"});
                    this.zone = this.map.getZone(this.character.pos.x+1, this.character.pos.y);
                    if (this.zone.level !== undefined) {
                        this.map = new Map(this.zone.level);
                        this.map.createMap();
                    }
                    this.character.pos.x = this.zone.pos.x;
                    this.character.pos.y = this.zone.pos.y;
                    this.character.map = this.map.name;
                    this.handler.emit('zoneEnterEvent', {char: this.character});
                    this.printZoneInfo();
                }
            } 
            //South
            else if (command[0].toLowerCase() == "s" || command[0].toLowerCase() == "south") {
                if (this.map.getZone(this.character.pos.x, this.character.pos.y+1) == false) {
                    this.print('You can not go this way!\r\n');
                } else {
                    this.handler.emit('zoneLeftEvent', {char: this.character, dir: "South"});
                    this.zone = this.map.getZone(this.character.pos.x, this.character.pos.y+1);
                    if (this.zone.level !== undefined) {
                        this.map = new Map(this.zone.level);
                        this.map.createMap();
                    }
                    this.character.pos.x = this.zone.pos.x;
                    this.character.pos.y = this.zone.pos.y;
                    this.character.map = this.map.name;
                    this.handler.emit('zoneEnterEvent', {char: this.character});
                    this.printZoneInfo();
                }
            } 
            //West
            else if (command[0].toLowerCase() == "w" || command[0].toLowerCase() == "west") {
                if (this.map.getZone(this.character.pos.x-1, this.character.pos.y) == false) {
                    this.print('You can not go this way!\r\n');
                } else {
                    this.handler.emit('zoneLeftEvent', {char: this.character, dir: "West"});
                    this.zone = this.map.getZone(this.character.pos.x-1, this.character.pos.y);
                    if (this.zone.level !== undefined) {
                        this.map = new Map(this.zone.level);
                        this.map.createMap();
                    }
                    this.character.pos.x = this.zone.pos.x;
                    this.character.pos.y = this.zone.pos.y;
                    this.character.map = this.map.name;
                    this.handler.emit('zoneEnterEvent', {char: this.character});
                    this.printZoneInfo();
                }
            }
            //Broadcast
            if (command[0].toLowerCase() == "say") {
                if (command.length < 2) {
                    this.print('You have to specify a text to say!');
                } else {
                    command[0] = '';
                    command = command.join(" ");
                    Config.sendZoneMessage(this.character, command);
                }
            }
            //whisper
            if (command[0].toLowerCase() == "whisper") {
                if (command.length == 1) {
                    this.print('Correct usage of the whisper command: whisper <name> <message>');
                } else if (command.length == 2) {
                    this.print('Correct usage of the whisper command: whisper <name> <message>');
                } else {
                    //Remove the command from the message
                    command.splice(0, 1);
                    Config.sendPrivateMessage(this.character, command);
                }
            }
            //who
            if (command[0].toLowerCase() == "who") {
                this.actionStack.push(new WhoAction(this, [command, Config]));
            }
            //Debug info
            if (command[0].toLowerCase() == "debug") {
                this.actionStack.push(new DebugAction(this, []));
            }
            //Logout command
            if (command[0].toLowerCase() == "logout" || command[0].toLowerCase() == "exit" || command[0].toLowerCase() == "quit") {
                this.actionStack.push(new LogoutAction(this, [Config]));
            }
            //TODO: attack / kill
            //TODO: friends add/delete
            //TODO: quest info/accept/abandon
            //TODO: logout
            
            //Save Character => Improve this if this causes performance issues
            Config.saveCharacter(this.character)
        }
    }

    printZoneInfo() {
        this.print('\r\n<green>' + this.zone.name + '</green>');
        this.print('\r\n\r\n' + this.zone.description);
        if (this.zone.npcs.length != 0) { 
            this.print('\r\n\r\nYou can see the following NPCs: ' + this.zone.npcs[0].name);
        }
        this.print('\r\nExits: ' + this.zone.exits + '\r\n');
    }

    print(text) {
        this.socket.write(Config.color(text));
    }

    update() {
        //Execute the commands queued
        if (this.actionStack.length != 0) {
            this.actionStack.pop().execute();
        }
    }   
}
