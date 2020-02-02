const Action = require('./action');

module.exports = class WhisperAction extends Action {
    execute() { 
        this.command = this.data[0];
        this.config = this.data[1];

        if (this.command.length <= 2) {
            this.commandHandler.print('Correct usage of the whisper command: whisper <name> <message>');
        } else {
            //Remove the command from the message
            this.command.splice(0, 1);
            this.config.sendPrivateMessage(this.commandHandler.character, this.command);
        }        
    }
}