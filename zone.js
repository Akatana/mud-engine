module.exports = class Zone {
    constructor (zone) {
        if (zone.name == 'mapChange') {
            this.name = zone.name;
            this.pos = zone.pos;
            this.level = zone.level;
            this.zone = zone.zone;
        } else {
            this.pos = zone.pos;
            this.name = zone.name;
            this.description = zone.description;
            this.items = zone.items;
            this.npcs = zone.npcs;
            this.enemies = zone.enemies;
            this.exits = zone.exits;
            this.players = [];
        }
    }

    createItems() {

    }

    createNpcs() {
        for (var i = 0; i < this.npcs.length; i++) {

        }
    }

    addEnemies() {

    }

    removeEnemy() {

    }

    addPlayer(name) {
        this.players.push(name);
    }

    removePlayer(name) {
        let index = this.players.indexOf(name);
        if (index > -1) {
            this.players.splice(index, 1);
        }
    }

    //Getters
    getDescription() {
        return this.description;
    }

}