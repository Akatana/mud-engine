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
        }
    }

    createItems() {

    }

    createNpcs() {
        for (var i = 0; i < this.npcs.length; i++) {

        }
    }

    createEnemies() {

    }

    removeEnemy() {

    }

    //Getters
    getDescription() {
        return this.description;
    }
}