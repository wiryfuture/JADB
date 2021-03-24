import { Client, Guild } from "discord.js"
import { servermodel } from "../schemas/server"

export const onGuildCreate = async (client: Client, guild: Guild) => {
  // Add guild to mongodb
  // Create server model
  var genericserverdoc = new servermodel({"serveruuid": guild.id})
  // creates new entry under server with server uuid and defaults
  await genericserverdoc.save()
}