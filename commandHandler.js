const Map = require('./maps');
const Config = require('./config');
const Player = require('./player');
const EventHandler = require('./eventHandler');

//Actions importieren
const WhoAction = require('./actions/who_action');
const DebugAction = require('./actions/debug_action');
const MapAction = require('./actions/map_action');
const LogoutAction = require('./actions/logout_action');
const MoveAction = require('./actions/move_action');
const WhisperAction = require('./actions/whisper_action');
const TalkAction = require('./actions/talk_action');

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
        this.client = false;
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
                    this.print('\r\nWe are happy to have you as a new player. Please answer the following questions to get started.');
                    this.print('\r\nWhat is your account name?');
                    this.print('\r\n\r\nAccount:');
                    this.state = 'register';
                } if (Config.checkAccount(command)) {
                    this.account.name = command;
                    this.print('\r\nWhat is your password? ');
                    this.print('\r\n\r\nPassword:');
                    this.step++;
                } else {
                    this.print('\r\nThis account does not exist.');
                    this.print('\r\nYou can either try again or type in (N)ew to create a new account.');
                    this.print('\r\n\r\nAccount:');
                }
            } else if (this.step == 1) {
                if (Config.compPassword(this.account.name, command)) {
                    this.account = Config.getAccount(this.account.name);
                    this.print('\r\nWelcome ' + this.account.name + '!');
                    this.print('\r\nPress <enter> to go to the Character Select screen.');
                    this.step = 0;
                    this.state = 'charSelection';
                } else {
                    this.print('\r\nThis password is not correct, please try again.');
                    this.print('\r\n\r\nPassword:');
                }
            }
        }
        //Register process
        else if (this.state === 'register') {
            if (this.step == 0) {
                if (Config.checkAccount(command)) {
                    this.print('\r\nThis account already exists. Please try again.');
                    this.print('\r\n\r\nAccount:');
                } else {
                    this.account.name = command;
                    this.print('\r\nPlease choose a password.')
                    this.print('\r\n\r\nPassword:')
                    this.step++;
                }
            } else if (this.step == 1) {
                this.account.pass = command;
                this.print('\r\nPlease repeat your password.')
                this.print('\r\n\r\nPassword:')
                this.step++;
            } else if (this.step == 2) {
                if (this.account.pass == command) {
                    Config.createAccount(this.account.name, this.account.pass);
                    this.account = Config.getAccount(this.account.name);
                    this.print('\r\nWelcome ' + this.account.name + '!');
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
            if (command[0].toLowerCase() == 'talk') {
                this.actionStack.push(new TalkAction(this, [command, Config]));
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
                this.actionStack.push(new MoveAction(this, ['n']));
            } 
            //East
            else if (command[0].toLowerCase() == "e" || command[0].toLowerCase() == "east") {
                this.actionStack.push(new MoveAction(this, ['e']));
            } 
            //South
            else if (command[0].toLowerCase() == "s" || command[0].toLowerCase() == "south") {
                this.actionStack.push(new MoveAction(this, ['s']));
            } 
            //West
            else if (command[0].toLowerCase() == "w" || command[0].toLowerCase() == "west") {
                this.actionStack.push(new MoveAction(this, ['w']));
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
                this.actionStack.push(new WhisperAction(this, [command, Config]));
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
        var zoneInfo = worldHandler.getMap(this.map.name).getZone(this.character.pos.x, this.character.pos.y);
        this.print('\r\n<green>' + zoneInfo.name + '</green>');
        this.print('\r\n' + zoneInfo.description);
        //Display NPC's
        for (let npc of zoneInfo.npcs) {
            this.print('\r\nYou can see the following NPCs: ' + npc.name);
        }
        //Display Players 
        if (zoneInfo.players.length > 0){
            let printed = false;
            for (let player of zoneInfo.players) {
                if (player != this.character.name) {
                    //Workaround for now...
                    if (printed == false) {
                        printed = true;
                        this.print('\r\nYou can see the following Players: ');
                    } 
                    this.print(player + ' ');
                } 
            } 
        } 
        this.print('\r\nExits: ' + zoneInfo.exits + '\r\n');
    }

    setClient() {
        this.client = true;
    }

    print(text) {
        this.socket.write(Config.color(text));
    }

    update() {
        //Transmit client data
        if (this.client) {
            console.log("test");
        }
        //Update the current Zone
        if (this.state == 'game') {
            this.zone = worldHandler.getMap(this.map.name).getZone(this.character.pos.x, this.character.pos.y);
        }

        //Execute the commands queued
        if (this.actionStack.length != 0) {
            this.actionStack.pop().execute();
        }
    }   

    sendClientData() {
        let data = {};
        //Set Map data
        for (let i = 0; i < this.map.map.layout.length; i++) {
            data.map.push()
        }
    }
}
