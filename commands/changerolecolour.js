module.exports = {
    name: "changerolecolour",
    guildonly: true,
    description: "Changes the colour of the \"quirky\" role.",
    async execute(client, message, args) {
        if (!args[0]) {
            return message.reply("Please give me a colour or do RANDOM, more info here https://discord.js.org/#/docs/main/stable/typedef/ColorResolvable.");
        }
        if (args[1]) {
            return message.reply("I only take one input, a colour, more info here https://discord.js.org/#/docs/main/stable/typedef/ColorResolvable.")
        }
        // Gets the colour of the role
        newrolecolour = args[0];
        // Finds the id for the role from its name
        let role = guild.roles.cache.find(role => role.name === "quirky");
        // Sets the role's new colour
        role.setColor(newrolecolour)
            .then(message.channel.send("Changed quirky colour to: " + newrolecolour))
            .catch(function (e) {
                if (e instanceof TypeError) {
                    message.reply("Please make sure you're providing a valid colour, more info on colours here https://discord.js.org/#/docs/main/stable/typedef/ColorResolvable.");
                }
                else {
                    message.reply("An unknown error occurred, try again later, then tell us.");
                }
            });
    },
}
