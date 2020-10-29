const path = require('path');
const databaseproxy = require(path.normalize("..//databases/databaseproxy.js"));

module.exports = {
    name: "prefix",
    guildonly: true,
    aliases: ["changeprefix"],
    description: "Defines the prefix the bot expects in your guild.",
    form: "A character or phrase.",
    async execute(client, message, args) {
        return new Promise((resolve, reject) => {
            databaseproxy.set(message.guild.id, "prefix", args[0])
            .then((err) => {
                if (err) reject(err);
                else resolve(message.reply("Set my prefix to: \""+ args[0] + "\""));
            });
        })
    },
}
