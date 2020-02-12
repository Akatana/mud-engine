var Map = require('./maps');
var fs = require('fs');
const path = require('path');

module.exports = class WorldHandler {

    constructor() {
        this.maps = [];
    }

    init() {
        //Map initialization
        fs.readdirSync('./levels').forEach(file => {
            let name = path.parse(file).name;
            let map = new Map(name);
            map.createMap();
            this.maps.push(map);
        });
    }

    getMaps() {
        return this.maps;
    }

    getMap(name) {
        let returnMap = "";
        this.maps.forEach(map => {
            if (map.name == name) {
                returnMap = map;
            }
        });
        return returnMap;
    }
}