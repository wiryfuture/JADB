const path = require('path')
const databaseproxy = require(path.normalize("..//databases/databaseproxy.js"));

module.exports = {
    name: "kick",
    guildonly: true,
    description: "Kicks someone from a server",
    async execute(client, message, args) {
        // Gets the moderator role for the server
        const modrole = await databaseproxy.get(message.guild.id, "modrole");
        // Checks the command issuer is a moderator in this server
        if (!message.member.roles.cache.some(r => [modrole].includes(r.name)))
            return message.reply("Sorry, you don't have permissions to use this!").then(message => {message.delete({timeout: 2000})}).catch(O_o => { });

        // Let's first check if we have a member and if we can kick them!
        // message.mentions.members is a collection of people that have been mentioned, as GuildMembers.
        // We can also support getting the member by ID, which would be args[0]
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!member)
            return message.reply("Please mention a valid member of this server").then(message => {message.delete({timeout: 2500})}).catch(O_o => { });
        if (!member.kickable)
            return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?").then(message => {message.delete({timeout: 2500})}).catch(O_o => { });

        // slice(1) removes the first part, which here should be the user mention or ID
        // join(' ') takes all the various parts to make it a single string.
        let reason = args.slice(1).join(' ');
        if (!reason) reason = "No reason provided";

        // Now, time for a swift kick in the nuts!
        await member.kick(reason)
            .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`)).then(message => {message.delete({timeout: 3000})}).catch(O_o => { });
        message.channel.send(`${member.user} has been kicked by ${message.author} because: ${reason}`);

    },
}
