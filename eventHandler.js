const EventEmitter = require('events');
const Config = require('./config');

module.exports = class EventHandler {
    constructor() {
        this.EventEmitter = new EventEmitter();

        //Zone left
        this.EventEmitter.on('zoneLeftEvent', function(data) {
            //Get sender Map and Zone
            if (data.isMob) {
                var map = data.mob.level;
                var pos = data.mob.pos;
                var name = data.mob.name;
            } else {
                var map = data.char.map;
                var pos = data.char.pos;
                var name = data.char.name;
                worldHandler.getMap(map).getZone(pos.x, pos.y).removePlayer(data.char.name);
            }
            
            //Notify other players
            for (var i = 0; i < players.length; i++) {
                if (data.isMob || players[i].character.name != data.char.name) {
                    if (map == players[i].character.map && pos.x == players[i].character.pos.x && pos.y == players[i].character.pos.y) {
                        players[i].socket.write(Config.color(`<magenta>${name} left the area to the ${data.dir}!</magenta>\r\n`));
                    }
                }
            }
        });

        //Zone entered
        this.EventEmitter.on('zoneEnterEvent', function(data) {
            //Get sender Map and Zone
            if (data.isMob == true) {
                var map = data.mob.level;
                var pos = data.mob.pos;
                var name = data.mob.name;
            } else {
                var map = data.char.map;
                var pos = data.char.pos; 
                var name = data.char.name;   
                worldHandler.getMap(map).getZone(pos.x, pos.y).addPlayer(data.char.name);
            }
            
            for (var i = 0; i < players.length; i++) {
                if (data.isMob || players[i].character.name != data.char.name) {
                    if (map == players[i].character.map && pos.x == players[i].character.pos.x && pos.y == players[i].character.pos.y) {
                        players[i].socket.write(Config.color(`<magenta>${name} entered the area.</magenta>\r\n`));
                    }
                }
            }
        });
    }

    emit(event, data) {
        this.EventEmitter.emit(event, data);
    }
}

