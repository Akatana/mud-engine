var Mob = require('./entities/mob');

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
            this.npcs = this.createNpcs(zone);
            this.enemies = zone.enemies;
            this.exits = zone.exits;
            this.players = [];
        }
    }

    createItems() {

    }

    createNpcs(zone) {
        let mobs = []
        for (var i = 0; i < zone.npcs.length; i++) {
            mobs.push(new Mob(zone.npcs[i]));
        }
        return mobs;
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