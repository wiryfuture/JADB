import { Client, Guild } from "discord.js"
import { servermodel } from "../schemas/server"

export const onGuildDelete = async (client: Client, guild: Guild) => {
  // Remove guild from mongodb
  await servermodel.exists({"serveruuid": guild.id }, async (err, result) => {
    if (result) {
      await servermodel.deleteOne({"serveruuid": guild.id })
      console.log("Deleted guild entry for", guild.id)
    }
    else {
      console.log("No guild db entry?? Nothing to delete.")
    }
  })
}