const discord = require('discord.js');
const path = require('path')
const databaseproxy = require(path.normalize("..//databases/databaseproxy.js"));

module.exports = {
    name: "help",
    cooldown: 2,
    guildonly: false,
    aliases: ["h","whatis"],
    description: "Tells you how to use other commands.",
    async execute(client, message, args) {
        message.delete().catch(O_o => { });
        var prefix;
        if (!message.channel.type === 'dm'){
            prefix = await databaseproxy.get(message.guild.id, "prefix");
        }
        else {
            prefix = "!";
        }
        const data= [];

        if (args[0]){
            const name = args[0].toLowerCase();
            // Checks if the argument given matches any of the server commands, server command aliases, dm commands or dm command aliases.
            const command = client.commands.get(name) || client.commands.find(c => c.aliases && c.aliases.includes(name));
            // Tells the user if the command they typed is invalid
            if (!command) {
                return message.reply("I couldn't find the command you want help with, sorry.").then(message => {message.delete({timeout: 2500})}).catch(O_o => { });
            }

            const helpembed = new discord.MessageEmbed()
                .setColor("#9b59b6")
                .setTitle(`What does \"${command.name}\" do ?`)
                .setDescription(`${command.description}`);
            
            if (command.aliases){
                helpembed.fields = { name: "Aliases:", value: `${command.aliases.join(", ")}` };
            }
            else {
                helpembed.fields = { name: "Aliases:", value: "No aliases available." };
            }
            return message.reply(helpembed); 
        }

        // Concludes that the user did not want help on a specific command, so sends a list of all commands available
        data.push("Here\'s a list of all my commands:");
        data.push(client.commands.map(command => command.name).join(', '));
        data.push(`\nYou can send \"${prefix}help [command name]\" to get info on a specific command!`);
        data.push("If you ask for help with a command in a server, I might get you some helpful contextual info!");

        return message.author.send(data, { split: true })
            .then(() => {
                //if (message.channel.type === 'dm') return;
                //message.reply('I\'ve sent you a DM with all my commands!');
            })
            .catch(error => {
                message.reply('it seems like I can\'t DM you! Do you have DMs disabled?').then(message => {message.delete({timeout: 5000})}).catch(O_o => { });
            });
    },
}