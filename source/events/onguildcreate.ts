import { Client, Guild } from "discord.js"

export const onGuildCreate = async (client: Client, guild: Guild) => {
  console.log(client, guild)
}