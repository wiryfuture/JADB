//const path = require('path')
//const databaseproxy = require(path.normalize("..//databases/databaseproxy.js"));
/*
module.exports = {
    name: "setting",
    cooldown: 2,
    guildonly: false,
    aliases: ["set","config"],
    description: "Used to change the settings of the bot on each server.",
    async execute(client, message, args) {
        // whatever the command does
    },
}
*/

/* If you need to find the modrole
// Gets the moderator role for the server
const modrole = await databaseproxy.get(message.guild.id, "modrole");
if (!message.member.roles.cache.some(r => [modrole].includes(r.name)))
            return message.reply("Sorry, you don't have permissions to use this!");
*/
