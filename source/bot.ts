if (!process.env.JADB_BOT_TOKEN) { // handle no bot token environment variable
    process.stderr.write("\n!!! No bot token provided !!!\n")
    process.stderr.write("!!! Set env JADB_BOT_TOKEN to the token !!!\n\n")
    process.exitCode = 1
    process.exit()
}
if (!process.env.JADB_MONGODB) { // handle when no mongodb connection string is passed
    process.stderr.write("\n!!! No mongodb string provided !!!\n")
    process.stderr.write("!!! Set env JADB_MONGODB to the connection string !!!\n\n")
    process.exitCode = 1
    process.exit()
}

import {Client} from "discord.js"
import {connect, connection} from "mongoose"
import {onMessage} from "./events/onmessage"
import {onGuildCreate} from "./events/onguildcreate"
import {onGuildDelete} from "./events/onguilddelete"
import {onReady} from "./events/onready"
import {loadCommands} from "./misc/loadcommands"

// Connect to mongodb
connect(process.env.JADB_MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
connection.on("error", (console.error.bind(console, "!! mongoDB connection failed !!"))) // handle errors (or don't)

const prefix = "!"
const client = new Client()
client.login(process.env.JADB_BOT_TOKEN);

const commands = loadCommands()

client.on("ready", async () => {onReady()})

client.on("guildCreate", async guild => {onGuildCreate(client, guild)})

client.on("guildDelete", async guild => {onGuildDelete(client, guild)})

client.on("message", async message => {onMessage(client, prefix, commands, message)})

