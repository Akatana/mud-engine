const Action = require('./action');
const Map = require('../maps');

module.exports = class MoveAction extends Action {
    execute() {
        let dir = this.data[0];
        let dirText = "";
        let x = 0;
        let y = 0;
        switch (dir) {
            case 'n':
                x = this.commandHandler.character.pos.x;
                y = this.commandHandler.character.pos.y-1;
                dirText = "North";
                break;
            case 's':
                x = this.commandHandler.character.pos.x;
                y = this.commandHandler.character.pos.y+1;        
                dirText = "South";
                break;
            case 'e':
                x = this.commandHandler.character.pos.x+1;
                y = this.commandHandler.character.pos.y;        
                dirText = "East";
                break;    
            case 'w':
                x = this.commandHandler.character.pos.x-1;
                y = this.commandHandler.character.pos.y;        
                dirText = "West";
                break;    
            default:
                break;
        }
        
        if (this.commandHandler.map.getZone(x, y) == false) {
            this.commandHandler.print('You can not go this way!\r\n');
        } else {
            this.commandHandler.handler.emit('zoneLeftEvent', {char: this.commandHandler.character, dir: dirText});
            this.commandHandler.zone = this.commandHandler.map.getZone(x, y);
            if (this.commandHandler.zone.level !== undefined) {
                this.commandHandler.map = new Map(this.commandHandler.zone.level);
                this.commandHandler.map.createMap();
            }
            this.commandHandler.character.pos.x = this.commandHandler.zone.pos.x;
            this.commandHandler.character.pos.y = this.commandHandler.zone.pos.y;
            this.commandHandler.handler.emit('zoneEnterEvent', {char: this.commandHandler.character});
            this.commandHandler.character.map = this.commandHandler.map.name;
            this.commandHandler.printZoneInfo();
        }
    }
}