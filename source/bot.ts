if (!process.env.JADB_BOT_TOKEN) { // handle no bot token environment variable
    process.stderr.write("\n!!! No bot token provided !!!\n")
    process.stderr.write("!!! Set env JADB_BOT_TOKEN to the token !!!\n\n")
    process.exitCode = 1
    process.exit()
}

import {Client} from "discord.js"
import {OnMessage} from "./onmessage"

const prefix = "!"

const client = new Client()
client.login(process.env.JADB_BOT_TOKEN);

client.on("ready", () => {
    process.stdout.write("Bot loaded\n")
})

client.on("guildCreate", guild => {
    console.log(guild)
})

client.on("guildDelete", guild => { 
    console.log(guild)
})

client.on("message", async message => {OnMessage(client, prefix, message)})

