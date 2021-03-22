"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadCommands = void 0;
const fs_1 = require("fs");
exports.loadCommands = () => {
    let commands = new Map();
    const commandfiles = fs_1.readdirSync(`${process.cwd()}/source/commands`).filter(file => file.endsWith('.ts'));
    for (const file of commandfiles) {
        const c = require(`${process.cwd()}/source/commands/${file}`);
        commands.set(c.name, c);
    }
    console.log(commands);
    return commands;
};
