"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
if (!process.env.JADB_BOT_TOKEN) {
    process.stderr.write("\n!!! No bot token provided !!!\n");
    process.stderr.write("!!! Set env JADB_BOT_TOKEN to the token !!!\n\n");
    process.exitCode = 1;
    process.exit();
}
const discord_js_1 = require("discord.js");
const onmessage_1 = require("./events/onmessage");
const onguildcreate_1 = require("./events/onguildcreate");
const onguilddelete_1 = require("./events/onguilddelete");
const onready_1 = require("./events/onready");
const prefix = "!";
const client = new discord_js_1.Client();
client.login(process.env.JADB_BOT_TOKEN);
client.on("ready", async () => { onready_1.onReady(); });
client.on("guildCreate", async (guild) => { onguildcreate_1.onGuildCreate(client, guild); });
client.on("guildDelete", async (guild) => { onguilddelete_1.onGuildDelete(client, guild); });
client.on("message", async (message) => { onmessage_1.onMessage(client, prefix, message); });
