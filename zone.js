var Mob = require('./entities/mob');

module.exports = class Zone {
    constructor (zone, level) {
        if (zone.name == 'mapChange') {
            this.name = zone.name;
            this.pos = zone.pos;
            this.level = zone.level;
            this.zone = zone.zone;
            this.npcs = [];
        } else {
            this.pos = zone.pos;
            this.level = level;
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
        //Weird Javascript behavior when passing this.pos directly...
        let pos = {'x': this.pos.x, 'y': this.pos.y};
        for (var i = 0; i < zone.npcs.length; i++) {
            mobs.push(new Mob(zone.npcs[i], pos, this.level));
        }
        return mobs;
    }

    addNpc(mob) {
        this.npcs.push(mob);
    }

    removeNpc(id) {
        for (let i = 0; i < this.npcs.length; i++) {
            if (this.npcs[i].id == id) {
                this.npcs.splice(i, 1);
            }
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

    update() {
        for (let npc of this.npcs) {
            npc.update();
        }
    }
}