const fs = require('fs');
const EventHandler = require('../eventHandler');

module.exports = class Mob {
    constructor(id, pos, level) {
        let mobData = 0;
        //Load Mob Data from file
        fs.readdirSync('./data/mobs').forEach(file => {
            let data = JSON.parse(fs.readFileSync(`./data/mobs/${file}`, 'utf8'));
            if (data.id == id) {
                mobData = data;
            }
        });

        this.id = id;
        this.name = mobData.name;
        this.pos = pos;
        this.level = level;
        this.dialogue = mobData.dialogue;
        this.moveSet = mobData.moveSet;
        this.moveIndex = 0;
        this.dialogueStack = [];
        this.ticks = 0;
        this.movementSpeed = 100;
        this.movementTicks = 100;
        this.handler = new EventHandler();
    }

    talkTo(handler) {
        this.dialogueStack.push({
            handler: handler,
            dialogueID: 0,
            ticks: 15,
        });
    }

    update() {
        //Dialogue Stack
        for (let i = 0; i < this.dialogueStack.length; i++) {
            if (this.dialogueStack[i].ticks == 0) {
                this.dialogueStack[i].handler.print(this.dialogue[this.dialogueStack[i].dialogueID] + '\r\n');
                this.dialogueStack[i].ticks = 15;
                this.dialogueStack[i].dialogueID++;
            }
            this.dialogueStack[i].ticks--;
            if (this.dialogueStack[i].dialogueID >= this.dialogue.length) {
                this.dialogueStack.splice(i, 1);
                i--;
            }
        }
        //Movement
        if (this.movementTicks == 0) {
            if (this.moveSet[this.moveIndex] == 'N') {
                let oldZone = worldHandler.getMap(this.level).getZone(this.pos.x, this.pos.y);
                let newZone = worldHandler.getMap(this.level).getZone(this.pos.x, this.pos.y - 1);
                if (newZone != false) {
                    oldZone.removeNpc(this.id);
                    this.handler.emit('zoneLeftEvent', {isMob: true, mob: this, dir: 'North'});
                    this.pos.y -= 1;
                    newZone.addNpc(this);
                    this.handler.emit('zoneEnterEvent', {isMob: true, mob: this, zone: newZone});
                }
            } else if (this.moveSet[this.moveIndex] == 'E') {
                let oldZone = worldHandler.getMap(this.level).getZone(this.pos.x, this.pos.y);
                let newZone = worldHandler.getMap(this.level).getZone(this.pos.x + 1, this.pos.y);
                if (newZone != false) {
                    oldZone.removeNpc(this.id);
                    this.handler.emit('zoneLeftEvent', {isMob: true, mob: this, dir: 'East'});
                    this.pos.x += 1;
                    newZone.addNpc(this);
                    this.handler.emit('zoneEnterEvent', {isMob: true, mob: this, zone: newZone});
                }
            } else if (this.moveSet[this.moveIndex] == 'S') {
                let oldZone = worldHandler.getMap(this.level).getZone(this.pos.x, this.pos.y);
                let newZone = worldHandler.getMap(this.level).getZone(this.pos.x, this.pos.y + 1);
                if (newZone != false) {
                    oldZone.removeNpc(this.id);
                    this.handler.emit('zoneLeftEvent', {isMob: true, mob: this, dir: 'South'});
                    this.pos.y += 1;
                    newZone.addNpc(this);
                    this.handler.emit('zoneEnterEvent', {isMob: true, mob: this, zone: newZone});
                }
            } else if (this.moveSet[this.moveIndex] == 'W') {
                let oldZone = worldHandler.getMap(this.level).getZone(this.pos.x, this.pos.y);
                let newZone = worldHandler.getMap(this.level).getZone(this.pos.x - 1, this.pos.y);
                if (newZone != false) {
                    oldZone.removeNpc(this.id);
                    this.handler.emit('zoneLeftEvent', {isMob: true, mob: this, dir: 'West'});
                    this.pos.x -= 1;
                    newZone.addNpc(this);
                    this.handler.emit('zoneEnterEvent', {isMob: true, mob: this, zone: newZone});
                }
            }
            this.moveIndex++;
            if (this.movementTicks == 0) {
                this.movementTicks = this.movementSpeed + Math.floor(Math.random() * 100);
            }
            if (this.moveIndex >= this.moveSet.length) {
                this.moveIndex = 0;
            }
        } else {
            this.movementTicks--;
        }
    }
}