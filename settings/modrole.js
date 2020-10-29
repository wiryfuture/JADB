const path = require('path');
const databaseproxy = require(path.normalize("..//databases/databaseproxy.js"));

module.exports = {
    name: "modrole",
    guildonly: true,
    aliases: ["changemod","setmod"],
    description: "Defines the moderator role for a server.",
    form: "An @ mention of the role.",
    async execute(client, message, args) {
        
            // Tries to get the role from the argument, works if it's an @ or just the name
            let role = await message.guild.roles.cache.find(role => role.name == args[0]);
            if (role == undefined) {
                role = await message.guild.roles.cache.find(role => role.id == args[0].slice(3, -1));
            }
            // Tells issuer if role doesn't exist
            if (role == undefined) {
                return message.reply("This role doesn't exist: \"" + args[0] +"\"");
            }
            return new Promise((resolve, reject) => {
                databaseproxy.set(message.guild.id, "modrole", role.name)
                .then((err) => {
                    if (err) reject(err);
                    else resolve(message.reply("Set moderator role to: \""+ args[0] + "\""));
                });
            })
            
        
    }
}

