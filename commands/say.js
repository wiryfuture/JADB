const discord = require("discord.js");

module.exports = {
    name: "say",
    guildonly: false,
    description: "Makes the bot say whatever you tell it.",
    async execute(client, message, args) {
        // makes the bot say something and delete the message. As an example, it's open to anyone to use. 
        // To get the "message" itself we join the `args` back into a string with spaces: 
        var sayMessage = args.join(" ");
        // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
        message.delete().catch(O_o => { });
        // Checks the bot doesn't say anything it's not allowed to
        if (sayMessage.toLowerCase().includes("fortnite")) {
            return message.reply("I'm not allowed to say \"" + "fortnite" + "\" :(").then(message => {message.delete({timeout: 2500})}).catch(O_o => { });
        }
        // Un-mention people by adding a period before an @
        sayMessage = sayMessage.replace("@", "@.");
        // And we get the bot to say the thing: 
        message.channel.send(sayMessage);
    },
}
