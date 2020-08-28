const path = require('path')
const databaseproxy = require(path.normalize("..//databases/databaseproxy.js"));

module.exports = {
    name: "purge",
    guildonly: true,
    description: "Deletes the number of messages given",
    async execute(client, message, args) {
        // Gets the moderator role for the server
        const modrole = await databaseproxy.get(message.guild.id, "modrole");
        // Checks if the command issuer is a moderator on the server or has the manage messages permission
        if (!message.member.roles.cache.some(r => [modrole].includes(r.name)) || !message.guild.member(message.author).hasPermission("MANAGE_MESSAGES"))
            return message.reply("Sorry, you don't have permissions to use this!").then(message => {message.delete({timeout: 2000})}).catch(O_o => { });
        // This command removes all messages from all users in the channel, up to 100.
        // get the delete count, as an actual number.
        var deleteCount = parseInt(args[0], 10);
        // Ooooh nice, combined conditions. <3
        //if (!deleteCount || deleteCount < 2 || deleteCount > 100)
            //return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");

        // If the number of messages to be deleted is above 100, decrease it to 100. Blame the discord API.
        if (deleteCount > 100) {
            deleteCount = 100;
        }
        // Sets the number of messages to delete to 2, so it deletes the command and message before it.
        if (deleteCount == 1) {
            deleteCount = 2;
        }
        // So we get our messages, and delete them. Simple enough, right?
        const fetched = await message.channel.messages.fetch({ limit: deleteCount });
        message.channel.bulkDelete(fetched)
            .then(() => {
                if (deleteCount > 1){
                    message.reply("Deleted " + deleteCount + " messages.").then(message => {message.delete({timeout: 5000})}).catch(O_o => { });
                }
                else {
                    message.reply("Deleted " + deleteCount + " message.").then(message => {message.delete({timeout: 5000})}).catch(O_o => { });
                }
            })
            .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
    },
}
