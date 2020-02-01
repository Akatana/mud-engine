module.exports = class Action {
    constructor(commandHandler, data){
        this.commandHandler = commandHandler;
        this.data = data;
    }

    execute() { 
        this.commandHandler.print("\r\nBasic Action.");
    }
}