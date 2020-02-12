const EventEmitter = require('events');
const Config = require('./config');

module.exports = class EventHandler {
    constructor() {
        this.EventEmitter = new EventEmitter();

        //Zone left
        this.EventEmitter.on('zoneLeftEvent', function(data) {
            //Get sender Map and Zone
            var map = data.char.map;
            var pos = data.char.pos;
            //Notify other players
            for (var i = 0; i < players.length; i++) {
                if (players[i].character.name != data.char.name) {
                    if (map == players[i].character.map && pos.x == players[i].character.pos.x && pos.y == players[i].character.pos.y) {
                        players[i].socket.write(Config.color(`<magenta>${data.char.name} left the area to the ${data.dir}!</magenta>\r\n`));
                    }
                }
            }
            worldHandler.getMap(map).getZone(pos.x, pos.y).removePlayer(data.char.name);
        });

        //Zone entered
        this.EventEmitter.on('zoneEnterEvent', function(data) {
            //Get sender Map and Zone
            var map = data.char.map;
            var pos = data.char.pos;
            var zone = data.zone;
            for (var i = 0; i < players.length; i++) {
                if (players[i].character.name != data.char.name) {
                    if (map == players[i].character.map && pos.x == players[i].character.pos.x && pos.y == players[i].character.pos.y) {
                        players[i].socket.write(Config.color(`<magenta>${data.char.name} entered the area.</magenta>\r\n`));
                    }
                }
            }
            worldHandler.getMap(map).getZone(pos.x, pos.y).addPlayer(data.char.name);
        });
    }

    emit(event, data) {
        this.EventEmitter.emit(event, data);
    }
}

