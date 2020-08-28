const path = require('path')
const databaseproxy = require(path.normalize("../..//databases/databaseproxy.js"));

module.exports = {
    name: "ban",
    description: "Bans a user from a server.",
    async execute(client, message, args) {
        // Gets the moderator role for the server
        const modrole = await databaseproxy.get(message.guild.id, "modrole");
        if (!message.member.roles.cache.some(r => [modrole].includes(r.name)))
            return message.reply("Sorry, you don't have permissions to use this!").then(message => {message.delete({timeout: 2000})}).catch(O_o => { });

        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!member)
            return message.reply("Please mention a valid member of this server").then(message => {message.delete({timeout: 2500})}).catch(O_o => { });
        if (!member.bannable)
            return message.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?").then(message => {message.delete({timeout: 2500})}).catch(O_o => { });

        let reason = args.slice(1).join(' ');
        if (!reason) reason = "No reason provided";

        await member.ban(reason)
            .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`)).then(message => {message.delete({timeout: 3000})}).catch(O_o => { });
        message.channel.send(`${member.user} has been banned by ${message.author} because: ${reason}`);
    },
}
