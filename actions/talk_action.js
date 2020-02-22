const Action = require('./action');

module.exports = class TalkAction extends Action {
    execute() {
        this.command = this.data[0]
        this.config = this.data[1];
        
        if (this.command.length > 1) {
            let zone = this.commandHandler.zone;
            for (let npc of zone.npcs) {
                if (this.config.compCommand(this.command[1], npc.name)) {
                    npc.talkTo(this.commandHandler);
                }
            }
        } else {
            this.commandHandler.print('\r\nIncorrect usage of the talk command.');
            this.commandHandler.print('\r\nCorrect syntax: talk <npc name>');
        }      
    }
}