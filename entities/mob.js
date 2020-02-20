const fs = require('fs');

module.exports = class Mob {
    constructor(id) {
        let mobData = 0;
        //Map initialization
        fs.readdirSync('./data/mobs').forEach(file => {
            let data = JSON.parse(fs.readFileSync(`./data/mobs/${file}`, 'utf8'));
            if (data.id == id) {
                mobData = data;
            }
        });

        this.id = id;
        this.name = mobData.name;
        this.dialogue = mobData.dialogue;
        this.moveSet = mobData.moveSet;
        this.moveIndex = 0;
        this.ticks = 0;
        this.dialogueStack = [];
    }

    update() {
        
    }
}