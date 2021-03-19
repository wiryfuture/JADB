"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onMessage = void 0;
const onMessage = async (client, prefix, message) => {
    if (message.author.bot)
        return;
    if (!message.content.startsWith(prefix))
        return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const commandName = args.shift().toLowerCase();
    if (commandName == "ping") {
        message.delete();
        const m = await message.channel.send("Ping?");
        m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`);
    }
    if (commandName == "pog") {
        message.reply("poggers");
    }
};
exports.onMessage = onMessage;
