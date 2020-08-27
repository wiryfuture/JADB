// Load up the discord.js library
const discord = require("discord.js");
const global = require("global")
//const document = require("global/document")
//const window = require("global/window")
const fs = require('fs');
const databaseproxy = require("./databases/databaseproxy.js");
const configgenerator = require("./defaultfiles/envgen.js");

// Load dotenv
// Access by process.env.{KEY}
const config = require('dotenv').config();
if (config.error) {
    console.warn("No environment file present, creating new one from default.");
    let killprocess = configgenerator.makenew()
    .then(() => {
        process.exit();
    });
}
// Checks if the config has been filled out (by the operator), things like the bot token or url of the database
configgenerator.checkpresence();
// Checks if the current env file is on the same update level as the default one
async function configupdatewrapper(){
    ismostrecent = await configgenerator.checkifrecent();
    // Updates the main .env file if the default one is newer
    if (!ismostrecent) {
        configgenerator.update();
    }
}
configupdatewrapper();

// process.env.token {string} bot token
// process.env.prefix {string} default bot prefix
// process.env.bannedwordslistname {string} default blacklisted words file

// This is your client. Some people call it `bot`, some people call it `self`, 
// some might call it `cootchie`. Either way, when you see `client.something`, or `bot.something`,
// this is what we're refering to. Your client.
const client = new discord.Client();

// Wait for enmap to be loaded 
/*
myenmap.defer.then( () => {
    console.log(myenmap.size + " keys loaded");
}); 
*/
// Set enmap settings
/*
client.settings = new enmap({
    name: "settings",
    fetchAll: false,
    autoFetch: true,
    cloneLevel: 'deep'
});

client.wordfilter = new enmap({ 
    name: "wordfilter",
    fetchAll: false,
    autoFetch: true,
    cloneLevel: 'deep'
});

// Default config for servers
const defaultsettings = {
    prefix: "!",
    modlogchannel: "mod-log",
    modrole: "Moderator",
    adminrole: "Admin",
    welcomechannel: "welcome",
    welcomemessage: "Say hello to {{user}}, everyone!",
    filterwords: false,
    dowelcomemessage: false,
    usecustomfilterlist: false
};
*/
const defaultwordfilter = {
    filename: "bannedwords.txt",
    words: ""
};



//tries to get the list of banned words from local file
async function getbannedwords(filename){
    return new Promise((resolve, reject) => {
        fs.readFile(filename, "utf8", (err, data) => {
            console.log("Read word file successfully!");
            bannedwords = data.split("\r\n");
            console.log("Successfully got " + bannedwords.length + " banned words from the list.");
            resolve(bannedwords);
        });
    });
}

function mystatus(client){
    if (client.guilds.cache.size == 1){
        client.user.setActivity(`Vibing in a server`);
        }
        else {
            client.user.setActivity(`Vibing in ${client.guilds.cache.size} servers`);
        }
}




client.on("ready", () => {
    // This event will run if the bot starts, and logs in, successfully.
    console.log(`Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`);
    const defaultbannedwords = getbannedwords("bannedwords.txt");
    // Example of changing the bot's playing game to something useful. `client.user` is what the
    // docs refer to as the "ClientUser".
    mystatus(client);
    
});

client.on("guildCreate", guild => {
    // This event triggers when the bot joins a guild.
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
    mystatus(client);
    databaseproxy.newserver(guild.id);
});

client.on("guildDelete", guild => {
    // this event triggers when the bot is removed from a guild.
    console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
    mystatus(client);
    client.settings.delete(guild.id);
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
    const guild = message.guild || null;

    if (guild == null) {
        return message.reply("Seems you've slid into my DMs, unfortunately, I'm not set up to be able to read them, lol :kissing_heart:  ");
    }
    
    // Get default server settings
    //const guildconf = client.settings.ensure(message.guild.id, defaultsettings);
    // Get default word filter setting
    const guildwordfilter = "bannedwords.txt";

    var guildid = guild.id;
    // Gets the guild settings
    
    const guildsettings = await databaseproxy.getall(guildid);

    // Here we separate our "command" name, and our "arguments" for the command. 
    // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
    // args = ["Is", "this", "the", "real", "life?"]
    const args = message.content.slice(guildsettings.prefix.length).trim().split(/ +/g);
    // command = say   
    const command = args.shift().toLowerCase();
    const messageasargs = message.content.trim().split(/ +/g);
    // dontsay : variable to let bot send message
    global.dontsay = 200;
    // checks if you have the role to bypass the filter (by default them mod role)
    //if (!message.member.roles.cache.some(r => ["Moderator"].includes(r.name))) {
    // For each banned word, 

    if (await databaseproxy.get(guild.id, "filterlanguage")) {
        // Checks messages against the default word filter
        if (true) {
            var banwords = await getbannedwords("bannedwords.txt");
            banwords.forEach(element => {
                // assumes that the message does not violate the blacklist by default
                violation = false;
                // For each word in the message, check if they are equal to said banned word.
                messageasargs.forEach(word => {
                    lowercaseword = word.toLowerCase();
                    if (lowercaseword == element) {
                        violation = true;
                    }
                });
                // searches a message for a banned word or phrase, returns -1 if it does not
                // gets the whole message in lower case for further analysis
                lowercasemessage = message.content.toLowerCase();
                // searches for the banned word or phrase
                containsbannedphrase = lowercasemessage.search(element);
                // length of the banned word
                lenghtofbannedword = element.length;

                if (containsbannedphrase != -1) {
                    violation = true;
                }
                // Acts if the message contains a banned word
                if (violation) {
                    message.delete().catch(O_o => { });
                    global.dontsay = 403;
                    message.author.send("Chill buddy, saying \"" + element + "\" isn't allowed!\nIf you think that this word or phrase should not be blacklisted, first please consider:\nIs it offensive?\nIs it distressing?\nIs it a sensitive topic that shouldn't be discussed here?");
                }
            });
        }
        // Else, check messages against custom word filter, which will be empty by default
        else {
            // Checks if a filename is provided for presets
            if (guildwordfilter.filename) {
                // Try use the word file with this name
                try {
                    bannedword = getbannedwords()
                }
                // Use default word file
                catch {

                }
            }
            // Use word list in guildwordfilter.words
            else {

            }
        }
        
    }
    
    
    //}

    // After this, the bot doesn't care about messages without a prefix
    if (message.content.indexOf(guildsettings.prefix) !== 0) return;

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
        if (!message.member.roles.cache.some(r => ["Moderator"].includes(r.name)))
            return message.reply("Sorry, you don't have permissions to use this!");
        // rus the function to get the list of banned words
        bannedwords = getbannedwords("bannedwords.txt");
        message.channel.send("Reloaded words from list.");
    }

    if (command === "kick") {
        // This command must be limited to mods and admins. In this example we just hardcode the role names.
        // Please read on Array.some() to understand this bit: 
        // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/some?
        if (!message.member.roles.cache.some(r => ["Moderator"].includes(r.name)))
            return message.reply("Sorry, you don't have permissions to use this!");

        // Let's first check if we have a member and if we can kick them!
        // message.mentions.members is a collection of people that have been mentioned, as GuildMembers.
        // We can also support getting the member by ID, which would be args[0]
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
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
        message.channel.send(`${member.user} has been kicked by ${message.author} because: ${reason}`);

    }

    if (command === "ban") {
        // Most of this command is identical to kick, except that here we'll only let admins do it.
        // In the real world mods could ban too, but this is just an example, right? ;)
        if (!message.member.roles.cache.some(r => ["Moderator"].includes(r.name)))
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
        message.channel.send(`${member.user} has been banned by ${message.author} because: ${reason}`);
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

    // Changes the colour of the role picked
    if (command == "changerolecolour") {
        if (!args[0]) {
            return message.reply("Please give me a colour or do RANDOM, more info here https://discord.js.org/#/docs/main/stable/typedef/ColorResolvable.");
        }
        if (args[1]) {
            return message.reply("I only take one input, a colour, more info here https://discord.js.org/#/docs/main/stable/typedef/ColorResolvable.")
        }

        newrolecolour = args[0];

        let role = guild.roles.cache.find(role => role.name === "quirky");

        role.setColor(newrolecolour)
            .then(message.channel.send("Changed quirky colour to " + newrolecolour))
            .catch(function (e) {
                if (e instanceof TypeError) {
                    message.reply("Please make sure you're providing a valid colour, more info on colours here https://discord.js.org/#/docs/main/stable/typedef/ColorResolvable.");
                }
                else {
                    message.reply("An unknown error occurred, try again later, then tell us.");
                }
            });

    }
    
    // Adds a word to the banned word list and reloads it, updating it on the fly
    if (command == "addbannedword") {
        if (!args[0]) {
            return message.reply("You at least need to give me a word, to be able to do this.");
        }
    }

    // Command to set config
    if (command == "setconf") {
        if (!message.member.roles.cache.some(r => [guildsettings.modrole].includes(r.name))) {
            return message.reply("You're not an admin, sowwy :(");
        }
        // Splits message into arguments
        const [prop, ...value] = args;
        // If the setting/key is not found
        if(!client.settings.has(message.guild.id, prop)) {
            return message.reply("This key is not in the configuration.");
        }
        // Applies setting change
        client.settings.set(message.guild.id, value.join(" "), prop);
        // Confirms everything worked and the value changed
        message.channel.send(`Guild configuration item ${prop} has been changed to:\n\`${value.join(" ")}\``);
    }

    // Add a setting after an update, hopefully can be deprecated because   u   g   l   y
    if (command == "addconf") {
        if (!message.member.roles.cache.some(r => [guildsettings.modrole].includes(r.name))) {
            return message.reply("You're not an admin, sowwy :(");
        }
         // Splits message into arguments
         const [prop, ...value] = args;
         // Applies setting change
         client.settings.set(message.guild.id, value.join(" "), prop);
         // Confirms everything worked and the value changed
         message.channel.send(`Guild configuration item ${prop} has been changed to:\n\`${value.join(" ")}\``);
    }

    // Shows a server's config
    if(command === "showconf") {
        if (!message.member.roles.cache.some(r => [guildsettings.modrole] == r.name)) {
            return message.reply("You're not an admin, sorry :(");
        }
        let configProps = Object.keys(guildconf).map(prop => {
          return `${prop}  :  ${guildconf[prop]}\n`;
        });
        message.channel.send(`The following are the server's current configuration:\`\`\`${configProps}\`\`\``);
      }
    

    // Debugging command to check things

    if (command == "debug") {
        let configProps = Object.keys(guildconf).map(prop => {
            return `${prop}  :  ${guildconf[prop]}\n`;
          });
        message.channel.send(`The following are the server's current configuration:\`\`\`${configProps}\`\`\``);
    }
    
    // End of code that manipulates messages
});

client.login(process.env.token);