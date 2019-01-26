module.exports = class Player {
    constructor(account, character, socket) {
        this.account = account;
        this.character = character;
        this.socket = socket;
    }

    logout() {
        this.socket.end();
    }
}