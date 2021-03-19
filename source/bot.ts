if (!process.env.JADB_BOT_TOKEN) { // handle no bot token environment variable
    process.stderr.write("\n!!! No bot token provided !!!\n")
    process.stderr.write("!!! Set env JADB_BOT_TOKEN to the token !!!\n\n")
    process.exitCode = 1
    process.exit()
}

import {Client} from "discord.js"
import {onMessage} from "./events/onmessage"
import {onGuildCreate} from "./events/onguildcreate"
import {onGuildDelete} from "./events/onguilddelete"
import {onReady} from "./events/onready"

const prefix = "!"

const client = new Client()
client.login(process.env.JADB_BOT_TOKEN);

client.on("ready", async () => {onReady()})

client.on("guildCreate", async guild => {onGuildCreate(client, guild)})

client.on("guildDelete", async guild => {onGuildDelete(client, guild)})

client.on("message", async message => {onMessage(client, prefix, message)})

