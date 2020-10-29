//const { RichPresenceAssets } = require('discord.js');
const discord = require('discord.js');
const path = require('path')
const databaseproxy = require(path.normalize("..//databases/databaseproxy.js"));


module.exports = {
    name: "setting",
    cooldown: 4,
    guildonly: false,
    aliases: ["set","config","settings"],
    description: "Description of what the command does",
    async execute(client, message, args) {
        const data = [];
        // Checks if no arguments are passed by checking if the number of entries is 0
        if (Object.entries(args).length == 0) {
            //return message.reply("This should print the settings available tbf").then(message => {message.delete({timeout: 2000})}).catch(O_o => { });
            // Make an array with the names of all the settings loaded by the bot
            data.push("Here\'s a list of all the settings available: ");
            data.push(client.settings.map(setting => setting.name).join(', '));
            data.push("\nRepeat this command with one of the settings you want to get information on, or want to modify.");

            return message.author.send(data, { split: true });
        }
        // Gets the first argument, which is the name of the setting to call
        const settingname = args.shift().toLowerCase();
        
        const setting = client.settings.get(settingname) || client.settings.find(c => c.aliases && c.aliases.includes(settingname));

        // Checks if the setting name passed is valid
        if (!setting) {
            return message.reply("I couldn't find that setting, sorry!").then(message => {message.delete({timeout: 2500})}).catch(O_o => { });
        }
        // Checks if any arguments were given after the setting
        if (Object.entries(args).length == 0) {
            // Copy of the code for the help embed but for the setting
            const helpembed = new discord.MessageEmbed()
                .setColor("#9b59b6")
                .setTitle(`What does \"${setting.name}\" do ?`)
                .setDescription(`${setting.description}`)
                .addFields(
                    { name: "Expected form:", value: setting.form },
                    { name: "Aliases:", value: `${setting.aliases.join(", ")}` }
                );
            /* Discordjs is ~~shi-~~terrible, so if this code is used, the first field with the expected form gets deleted. nice. I hate this.
            if (setting.aliases){
                helpembed.field = { name: "Aliases:", value: `${setting.aliases.join(", ")}`};
            }
            else {
                helpembed.fields = { name: "Aliases:", value: "No aliases available."};
            }
            */
            return message.reply(helpembed); 
        }

        // Gets the rest of the arguments
        //const settingarguments = args;

        // Run setting command for DM
        if (message.channel.type === 'dm') {
            data.push("No personal global settings for you to modify here yet :(");
            
            return message.author.send(data, {split: true});
        }
        // Run setting command for guilds
        else {
            const modrole = await databaseproxy.get(message.guild.id, "modrole");
            if (!message.member.roles.cache.some(r => [modrole].includes(r.name))) {
                return message.reply("Sorry, you don't have permission to change settings!").then(message => {message.delete({timeout: 2000})}).catch(O_o => { });
            }

            // Tries to modify the setting given by the issuer
            try {
                setting.execute(client, message, args);
            } catch (error) {
                // Tells the user if the command failed to run
                console.error(error);
                message.reply('There was an error trying to modify that setting.');
            }
        }
    },
}
