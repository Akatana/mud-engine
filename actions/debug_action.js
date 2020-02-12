const Action = require('./action');

module.exports = class DebugAction extends Action {
    execute() {
        if (this.commandHandler.account.admin == false) {
            this.commandHandler.print("You don't have access to this command.")
        } else {
            //Console output
            console.log("Account:");
            console.log(this.commandHandler.account);
            console.log("Character:");
            console.log(this.commandHandler.character);
            console.log("Map:");
            console.log(worldHandler.getMap(this.commandHandler.map.name));
            console.log("Zone:");
            console.log(worldHandler.getMap(this.commandHandler.map.name).getZone(this.commandHandler.character.pos.x, this.commandHandler.character.pos.y));

            //Ingame output
            this.commandHandler.print("\r\nAccount: " + this.commandHandler.account.name);
            this.commandHandler.print("\r\nCurrent Character: " + this.commandHandler.character.name);
            this.commandHandler.print("\r\nMap: " + this.commandHandler.character.map);
            this.commandHandler.print("\r\nPosition: [" + this.commandHandler.character.pos.x + ', ' + this.commandHandler.character.pos.y + ']\r\n');
        }
    }
}