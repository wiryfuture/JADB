module.exports = {
    name: "rolecolour",
    guildonly: true,
    description: "Gets the colour of a role and displays it.",
    async execute(client, message, args) {
        //let role = message.guild.roles.cache.find(role => role.name == args[0]);
        let role = await message.guild.roles.cache.find(role => role.name == args[0]);
        if (role == undefined) {
            role = await message.guild.roles.cache.find(role => role.id == args[0].slice(3, -1));
        }
        message.delete().catch(O_o => { });
        if (role == undefined) {
            return message.reply("This role doesn't exist: \"" + args[0] +"\"").then(message => {message.delete({timeout: 3000})}).catch(O_o => { });
        }
        // Gets the role's colour
        rolecolour = role.hexColor;
        // Sends an embed with the role's colour etc
        return message.reply({embed: {
            author: {
                name: role.name,
                icon_url: `https://www.colorhexa.com/${rolecolour.slice(1)}.png` 
            },
            color: rolecolour,
            title: rolecolour,
            description: "is the colour of \"" + role.name + "\""
        }}).then(message => {message.delete({timeout: 10000})}).catch(O_o => { });
    },
}
