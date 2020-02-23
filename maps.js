var Zone = require('./zone');
var fs = require('fs');

module.exports = class Map {

    constructor(map) {
        this.map = map;
        this.zones = [];
        this.name = '';
    }

    createMap() {
        let isLoaded = false;
        worldHandler.getMaps().forEach(map => {
            if (map.name == this.map) {
                isLoaded = true;
                this.map = map.map;
                this.name = map.name;
                this.createZones();
            }
        });
        if (isLoaded == false) {
            let data = fs.readFileSync(`./levels/${this.map}.json`, 'utf8');
            this.map = JSON.parse(data);
            this.name = this.map.name;
            this.createZones();
        }
    }

    createZones() {
        //name, description, items, npcs, enemies, exits
        for (var i = 0; i < this.map.zones.length; i++) {
            var zone = new Zone(this.map.zones[i], this.name);
            this.zones.push(zone);
        }       
    }

    getZone(x, y, z = 0) {
        for (var i = 0; i < this.zones.length; i++) {
            if (this.zones[i].pos.x == x && this.zones[i].pos.y == y) {
                //Check if a map change happens
                if (this.zones[i].name == 'mapChange') {
                    var map = new Map(this.zones[i].level);
                    map.createMap();
                    var zone = map.getZone(this.zones[i].zone.x, this.zones[i].zone.y);
                    zone.level = this.zones[i].level;
                    return zone;
                }
                return this.zones[i];
            } 
        }
        return false;
    }

    update() {
        for (let zone of this.zones) {
            zone.update();
        }
    }
}