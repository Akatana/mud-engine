const Action = require('./action');

module.exports = class LogoutAction extends Action {
    execute() {
        this.config = this.data[0];
        
        this.config.saveCharacter(this.commandHandler.character);
        this.commandHandler.print("Saved Character... Logging out.\r\n");
        this.commandHandler.socket.destroy();
    }
}