import { Client, Guild } from "discord.js"

export const onGuildDelete = async (client: Client, guild: Guild) => {
  console.log(client, guild)
}