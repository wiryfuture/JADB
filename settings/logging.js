const path = require('path');
const databaseproxy = require(path.normalize("..//databases/databaseproxy.js"));

function checkbool(argument, currentvalue, message) {
    if (argument === "yes" || argument === "true") {
        return true;
    }
    if (argument === "no" || argument === "false") {
        return false;
    }
    if (argument === "toggle") {
        // Toggles the current boolean
        return !currentvalue;
    }
    if (!argument){
        return currentvalue;
    }
}

module.exports = {
    name: "logging",
    guildonly: true,
    aliases: ["dologging"],
    description: "Whether I should log actions in this server. Can be individually configured. A type of toggle on its own will tell you its value.",
    form: "The type of logging, default \"global\", followed by \"True\", \"false\", \"yes\", \"no\" or \"toggle\".",
    async execute(client, message, args) {
        // Current option for filtering language
        let currentsetting = await databaseproxy.get(message.guild.id, "logging");
        // Run if an argument is given first. Switch case is ideal here.

        switch(args[0].toLowerCase()) {
            // Iterates through each currently available option
            case "global":
                result = checkbool(args[1], currentsetting, message);
                if (result == currentsetting) {
                    return message.reply("You need to provide an argument that you want to set logging to.")
                }
            default:
                result = checkbool(args[0], currentsetting, message);
                if (result == currentsetting) {
                    return message.reply("You need to provide an argument that you want to set logging to.")
                }
        }

        // Writes to db
        return new Promise((resolve, reject) => {
            databaseproxy.set(message.guild.id, "logging", result)
            .then((err) => {
                if (err) reject(err);
                else resolve(message.reply("Set logging to: \""+ result + "\""));
            });
        })
    },
}
