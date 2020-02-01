const Action = require('./action');

module.exports = class mapAction extends Action {
    execute() {
        for (let i = 0; i < this.commandHandler.map.map.layout.length; i++) {
            this.commandHandler.print('\r\n');
            for (let j = 0; j < this.commandHandler.map.map.layout[i].length; j++) {
                if (i == this.commandHandler.character.pos.y && j == this.commandHandler.character.pos.x) {
                    this.commandHandler.print('<magenta>@</magenta>');
                } else {
                    this.commandHandler.print(this.commandHandler.map.map.layout[i][j]);
                }

            }
        }
        this.commandHandler.print('\r\n');
    }
}