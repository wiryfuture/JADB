"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onMessage = void 0;
const onMessage = async (client, prefix, commands, message) => {
    if (message.author.bot)
        return;
    if (!message.content.startsWith(prefix))
        return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const commandName = args.shift().toLowerCase();
    const command = commands.get(commandName) || commands.forEach(cmd => { if (cmd.aliases.includes(commandName))
        return cmd; });
    try {
        command.execute(client, message, args);
    }
    catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
    if (commandName == "pog") {
        message.reply("poggers");
    }
};
exports.onMessage = onMessage;
