const fs = require('fs');

module.exports = class Mob {
    constructor(id) {
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
        this.dialogue = mobData.dialogue;
        this.moveSet = mobData.moveSet;
        this.moveIndex = 0;
        this.dialogueStack = [];
    }

    talkTo(handler) {
        this.dialogueStack.push({
            handler: handler,
            dialogueID: 0,
            ticks: 15
        });
    }

    update() {
        for (let i = 0; i < this.dialogueStack.length; i++) {
            if (this.dialogueStack[i].ticks == 0) {
                this.dialogueStack[i].handler.print(this.dialogue[this.dialogueStack[i].dialogueID] + '\r\n');
                this.dialogueStack[i].ticks = 15;
                this.dialogueStack[i].dialogueID++;
            }
            this.dialogueStack[i].ticks--;
            if (this.dialogueStack[i].dialogueID > this.dialogue.length) {
                this.dialogueStack.splice(i, 1);
                i--;
            }
        }
    }
}