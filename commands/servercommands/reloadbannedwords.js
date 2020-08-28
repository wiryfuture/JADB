const fs = require('fs');
const path = require('path')
const databaseproxy = require(path.normalize("../..//databases/databaseproxy.js"));

module.exports = {
    name: "reloadbannedwords",
    description: "Reloads the banned words the bot has in memory for use.",
    async execute(client, message, args) {
        // Gets the moderator role for the server
        const modrole = await databaseproxy.get(message.guild.id, "modrole");
        // Checks the command issuer is a moderator in this server
        if (!message.member.roles.cache.some(r => [modrole].includes(r.name)))
            return message.reply("Sorry, you don't have permissions to use this!");
        // rus the function to get the list of banned words
        bannedwords = getbannedwords("bannedwords.txt");
        message.channel.send("Reloaded words from list.");
    },
};

//tries to get the list of banned words from local file
async function getbannedwords(filename){
    return new Promise((resolve, reject) => {
        fs.readFile(filename, "utf8", (err, data) => {
            console.log("Read word file successfully!");
            bannedwords = data.split("\r\n");
            console.log("Successfully got " + bannedwords.length + " banned words from the list.");
            resolve(bannedwords);
        });
    });
}