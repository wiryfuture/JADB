const path = require('path')
const databaseproxy = require(path.normalize("../..//databases/databaseproxy.js"));

module.exports = {
    name: "makerole",
    description: "Makes a role using the arguments passed.",
    async execute(client, message, args) {
        // Gets the moderator role for the server
        const modrole = await databaseproxy.get(message.guild.id, "modrole");
        // Checks if the command issuer is a moderator in this server
        if (!message.member.roles.cache.some(r => [modrole].includes(r.name)))
            return message.reply("Sorry, you don't have permissions to use this!").then(message => {message.delete({timeout: 2000})}).catch(O_o => { });
        
        if (!args[0] || !args[1]) {
            return message.reply("You need to give me a name and colour.").then(message => {message.delete({timeout: 2500})}).catch(O_o => { });
        }

        var rolename = args[0];
        var rolecolour = args[1];

        guild.roles.create({
            data: {
                name: rolename,
                color: rolecolour,
                mentionable: false,
            },
            reason: "<@" + message.author + "> asked for this role.",
        })
            .then(message.channel.send("Made role with the name \"" + rolename + "\" and colour \"" + rolecolour + "\" thanks to <@" + message.author + ">"))
            .catch(function (err) {
                message.channel.send("I got an error but can\'t tell you it because I'm usewess o(〒﹏〒)o");
                throw err;
    });
    },
}
