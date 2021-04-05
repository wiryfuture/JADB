module.exports = {
    name: "settings",
    aliases: ["setting", "options"],
    description: "Lets users change settings",
    cooldown: 5,
    guildonly: false,
    execute: async (client, message) => {
        message.delete()
            const m = message.reply("Nothing here yet")
    }
}