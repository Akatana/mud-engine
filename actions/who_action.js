const Action = require('./action');

module.exports = class WhoAction extends Action {
    execute() { 
        this.command = this.data[0];
        this.config = this.data[1];

        if (this.command.length == 1) {
            this.commandHandler.print('There are currently <red>' + players.length + '</red> players playing on the server.\r\n');
        } else if (this.command.length == 2) {
            let name = this.command[1];
            for (let i = 0; i < players.length; i++) {
                if (this.config.compCommand(players[i].character.name, name)) {
                    this.commandHandler.print(players[i].character.name + ' is a ' + players[i].character.race + ' Level ' + players[i].character.level + ' ' + players[i].character.class);
                }
            } 
        } else {
            this.commandHandler.print('Correct usage of the who command is either simply who or who <char name>\r\n');
        }
    }
}