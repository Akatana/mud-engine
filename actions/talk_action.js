const Action = require('./action');

module.exports = class TalkAction extends Action {
    execute() {
        this.command = this.data[0]
        this.config = this.data[1];
        
        if (this.command.length > 1) {
            if (this.config.compCommand(this.command[1], this.commandHandler.zone.npcs[0].name)) {
                this.commandHandler.print('\r\n'+this.commandHandler.zone.npcs[0].text);
            }
        } else {
            this.commandHandler.print('\r\nIncorrect usage of the talk command.');
            this.commandHandler.print('\r\nCorrect syntax: talk <npc name>');
        }      
    }
}