"use strict";
module.exports = {
    name: "ping",
    description: "Calculates the ping of the bot",
    cooldown: 5,
    guildonly: false,
    execute: async (client, message) => {
        message.delete();
        const m = await message.channel.send("Ping?");
        m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`);
    }
};
