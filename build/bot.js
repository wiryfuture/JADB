"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
if (!process.env.JADB_BOT_TOKEN) {
    process.stderr.write("\n!!! No bot token provided !!!\n");
    process.stderr.write("!!! Set env JADB_BOT_TOKEN to the token !!!\n\n");
    process.exitCode = 1;
    process.exit();
}
const discord_js_1 = require("discord.js");
const onmessage_1 = require("./onmessage");
const prefix = "!";
const client = new discord_js_1.Client();
client.login(process.env.JADB_BOT_TOKEN);
client.on("ready", () => {
    process.stdout.write("Bot loaded\n");
});
client.on("guildCreate", guild => {
    console.log(guild);
});
client.on("guildDelete", guild => {
    console.log(guild);
});
client.on("message", async (message) => { onmessage_1.OnMessage(client, prefix, message); });
