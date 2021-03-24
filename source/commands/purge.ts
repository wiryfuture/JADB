module.exports = {
    name: "purge",
    description: "Deletes the number of messages given",
    cooldown: 2,
    guildonly: true,
    async execute(client, message, args) {
        // Checks if the command issuer is a moderator on the server or has the manage messages permission
        if (!message.guild.member(message.author).hasPermission("MANAGE_MESSAGES"))
            return message.reply("Sorry, you don't have permissions to use this!").then(message => {message.delete({timeout: 2000})})
        var deleteCount = parseInt(args[0], 10);
            
        if (Math.floor(deleteCount / 100)) {
            // Delete messages by full 100s as much as possible
            for (let x = 0; x < Math.floor(deleteCount / 100); x++) {
                const fetched = await message.channel.messages.fetch({ limit: 100 })
                await message.channel.bulkDelete(fetched).catch(error => message.reply(`Couldn't delete messages because of: ${error}`))
            }
        }
        // Delete remainder of messages below 100 here
        if (deleteCount % 100) {
            const fetched = await message.channel.messages.fetch({ limit: deleteCount % 100 })
            await message.channel.bulkDelete(fetched).catch(error => message.reply(`Couldn't delete messages because of: ${error}`))
        }
        message.reply("Deleted " + deleteCount + " messages.").then(message => {message.delete({timeout: 5000})})
    },
}