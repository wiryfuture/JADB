const path = require('path');
const databaseproxy = require(path.normalize("..//databases/databaseproxy.js"));

module.exports = {
    name: "togglefilter",
    guildonly: true,
    aliases: ["filter","filterlanguage"],
    description: "Toggles the word filter on a server.",
    form: "\"True\", \"false\", \"yes\", \"no\", or \"toggle\"",
    async execute(client, message, args) {
        // Current option for filtering language
        let currentsetting = await databaseproxy.get(message.guild.id, "filterlanguage");
        // Toggles the current boolean
        if (args[0] === "toggle") {
            result = !currentsetting;
        }
        // Sets boolean to true
        if (args[0] === "yes" || args[0] === "true") {
            result = true;
        }
        // Sets boolean to false
        if (args[0] === "no" || args[0] === "false") {
            result = false;
        }
        // Writes to db
        return new Promise((resolve, reject) => {
            databaseproxy.set(message.guild.id, "filterlanguage", result)
            .then((err) => {
                if (err) reject(err);
                else resolve(message.reply("Set the filter to: \""+ result + "\""));
            });
        })

    },
}
