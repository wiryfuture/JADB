// Load up the discord.js library
const Discord = require("discord.js");
const global = require("global")
const document = require("global/document")
const window = require("global/window")
const fs = require('fs');

// This is your client. Some people call it `bot`, some people call it `self`, 
// some might call it `cootchie`. Either way, when you see `client.something`, or `bot.something`,
// this is what we're refering to. Your client.
const client = new Discord.Client();

// Here we load the config.json file that contains our token and our prefix values. 
// old boomer code :: const config = require("./config.json");
const { prefix, token, bannedwordslistname } = require("./config.json");

// config.token contains the bot's token
// config.prefix contains the message prefix.
// config.bannedwordslistname contains the name of the file with the list of banned words

//tries to get the list of banned words from local file
function getbannedwords(){
    fs.readFile(bannedwordslistname, "utf8", (err, data) => {
        console.log("Read word file successfully!");
        global.bannedwords = data.split("\r\n");
        console.log("Successfully got " + global.bannedwords.length.toString() + " banned words from the list.");
    });

}

function mystatus(client){
    if (client.guilds.cache.size == 1){
        client.user.setActivity(`Straight vibing in a server`);
        }
        else {
            client.user.setActivity(`Vibing on ${client.guilds.cache.size} servers`);
        }
}

client.on("ready", () => {
    // This event will run if the bot starts, and logs in, successfully.
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
    getbannedwords();
    // Example of changing the bot's playing game to something useful. `client.user` is what the
    // docs refer to as the "ClientUser".
    mystatus(client);
    
});

client.on("guildCreate", guild => {
    // This event triggers when the bot joins a guild.
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
    mystatus(client);
});

client.on("guildDelete", guild => {
    // this event triggers when the bot is removed from a guild.
    console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
    mystatus(client);
});


client.on("message", async message => {
    // This event will run on every single message received, from any channel or DM.

    // It's good practice to ignore other bots. This also makes your bot ignore itself
    // and not get into a spam loop (we call that "botception").
    if (message.author.bot) return;

    // Commands that will run for all messages 

    // Also good practice to ignore any message that does not start with our prefix, 
    // which is set in the configuration file.
    //if (message.content.indexOf(config.prefix) !== 0) return;

    // Here we separate our "command" name, and our "arguments" for the command. 
    // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
    // command = say
    // args = ["Is", "this", "the", "real", "life?"]
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const guild = message.guild || null;

    const messageasargs = message.content.trim().split(/ +/g);
    // dontsay : variable to let bot send message
    global.dontsay = 200;
    // checks if you have the role to bypass the filter
    if (!message.member.roles.cache.some(r => ["Moderator"].includes(r.name))) {
        // For each banned word, 
        global.bannedwords.forEach(element => {
            // For each word in the message, check if they are equal.
            messageasargs.forEach(word => {
                lowercaseword = word.toLowerCase();
                if (lowercaseword == element) {
                    message.author.send("Chill buddy, saying \"" + element + "\" isn't allowed!");
                    message.delete().catch(O_o => { });
                    global.dontsay = 403;
                }
            });
            /*
            lowercasemessagecontent = message.content.toLowerCase();
            if (lowercasemessagecontent.includes(element)) {
                message.author.send("Chill buddy, saying \"" + element + "\" isn't allowed!");
                message.delete().catch(O_o => { });
                global.dontsay = 403;
            }
            */
        });
    }

    // After this, the bot doesn't care about messages without a prefix
    if (message.content.indexOf(prefix) !== 0) return;

    // Let's go with a few common example commands! Feel free to delete or change those.

    if (command === "say") {
        // makes the bot say something and delete the message. As an example, it's open to anyone to use. 
        // To get the "message" itself we join the `args` back into a string with spaces: 
        var sayMessage = args.join(" ");
        // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
        message.delete().catch(O_o => { });

        // Checks the bot doesn't say anything it's not allowed to

        if (sayMessage.toLowerCase().includes("fortnite")) {
            message.author.send("I'm not allowed to say \"" + "fortnite" + "\" :(");
            global.dontsay = 403;
        }

        if (sayMessage.toLowerCase().includes("@")) {
            sayMessage = sayMessage.replace("@", "@.");
        }


        // And we get the bot to say the thing: 
        if (global.dontsay == 200) {
            message.channel.send(sayMessage);
        }
    }


    if (command === "ping") {
        // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
        // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
        const m = await message.channel.send("Ping?");
        m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`);
    }

    // lets a moderator reload the list of banned words (example use: the list has been updates)
    if (command === "reloadbannedwords") {
        if (!message.member.roles.some(r => ["Moderator"].includes(r.name)))
            return message.reply("Sorry, you don't have permissions to use this!");
        // rus the function to get the list of banned words
        getbannedwords();
        message.channel.send("Reloaded banned words list.");
    }

    if (command === "kick") {
        // This command must be limited to mods and admins. In this example we just hardcode the role names.
        // Please read on Array.some() to understand this bit: 
        // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/some?
        if (!message.member.roles.some(r => ["Moderator"].includes(r.name)))
            return message.reply("Sorry, you don't have permissions to use this!");

        // Let's first check if we have a member and if we can kick them!
        // message.mentions.members is a collection of people that have been mentioned, as GuildMembers.
        // We can also support getting the member by ID, which would be args[0]
        let member = message.mentions.members.first() || message.guild.members.get(args[0]);
        if (!member)
            return message.reply("Please mention a valid member of this server");
        if (!member.kickable)
            return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");

        // slice(1) removes the first part, which here should be the user mention or ID
        // join(' ') takes all the various parts to make it a single string.
        let reason = args.slice(1).join(' ');
        if (!reason) reason = "No reason provided";

        // Now, time for a swift kick in the nuts!
        await member.kick(reason)
            .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
        message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);

    }

    if (command === "ban") {
        // Most of this command is identical to kick, except that here we'll only let admins do it.
        // In the real world mods could ban too, but this is just an example, right? ;)
        if (!message.member.roles.some(r => ["Moderator"].includes(r.name)))
            return message.reply("Sorry, you don't have permissions to use this!");

        let member = message.mentions.members.first();
        if (!member)
            return message.reply("Please mention a valid member of this server");
        if (!member.bannable)
            return message.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");

        let reason = args.slice(1).join(' ');
        if (!reason) reason = "No reason provided";

        await member.ban(reason)
            .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
        message.reply(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);
    }

    if (command === "purge") {
        // This command removes all messages from all users in the channel, up to 100.

        // get the delete count, as an actual number.
        const deleteCount = parseInt(args[0], 10);

        // Ooooh nice, combined conditions. <3
        if (!deleteCount || deleteCount < 2 || deleteCount > 100)
            return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");

        // So we get our messages, and delete them. Simple enough, right?
        const fetched = await message.channel.fetchMessages({ limit: deleteCount });
        message.channel.bulkDelete(fetched)
            .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
    }

    if (command == "makerole") {
        if (!guild) {
            return message.reply("I can't make a role outside of a server.");
        }

        if (!message.member.roles.cache.some(r => ["Moderator"].includes(r.name))) {
            return message.reply("No.");
        }

        if (!args[0] || !args[1]) {
            return message.reply("You need to give me a name and colour.");
        }

        if (args[2]) {
            return message.reply("Only two arguments pwease, name and colour kthx ahaha. >_<");
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

    }

    if (command == "changerolecolour") {
        if (!args[0]) {
            return message.reply("Please give me a colour or do RANDOM, more info here https://discord.js.org/#/docs/main/stable/typedef/ColorResolvable.");
        }
        if (args[1]) {
            return message.reply("I only take one input, a colour, more info here https://discord.js.org/#/docs/main/stable/typedef/ColorResolvable.")
        }

        newrolecolour = args[0];

        let role = guild.roles.cache.find(role => role.name === "quirky");

        role.setColor({ newrolecolour })
            .then(message.channel.send("Changed role colour to " + newrolecolour))
            .catch(message.reply("Please make sure you're providing a valid colour, more info on colours here https://discord.js.org/#/docs/main/stable/typedef/ColorResolvable."));

    }

    

    // Debugging command to check things

    if (command == "debug") {
        message.reply(args[0]);
    }
    
    // End of code that manipulates messages
});

client.login(token);