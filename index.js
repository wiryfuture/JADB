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

const cooldowns = new discord.Collection();
client.servercommands = new discord.Collection();
client.dmcommands = new discord.Collection();
const servercommandFiles = fs.readdirSync('./commands/servercommands').filter(file => file.endsWith('.js'));
const dmcommandFiles = fs.readdirSync('./commands/dmcommands').filter(file => file.endsWith('.js'));

// Loads commands for use in servers
for (const file of servercommandFiles) {
	const servercommand = require(`./commands/servercommands/${file}`);
	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.servercommands.set(servercommand.name, servercommand);
};
// loads commands for use in the bot's DM
for (const file of dmcommandFiles) {
	const dmcommand = require(`./commands/dmcommands/${file}`);
	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.dmcommands.set(dmcommand.name, dmcommand);
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

    // Gets the guild from the message, if not in a guild, set null
    const guild = message.guild || null;

    // Executes if a message is received in a DM
    if (guild == null) {
        // Sets the prefix for the bot in people's DMs to this default, might add a global settings in db later
        const prefix = "!";

        // Here we separate our "command" name, and our "arguments" for the command. 
        // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
        // args = ["Is", "this", "the", "real", "life?"]
        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        // command = say   
        const command = args.shift().toLowerCase();
        const messageasargs = message.content.trim().split(/ +/g);

        
        const commandcontent = client.dmcommands.get(command) || client.dmcommands.find(cmd => cmd.aliases && cmd.aliases.includes(command));
        
        if (!message.content.startsWith(prefix)) {
            return;
        }

        if (!commandcontent) {
            return message.reply("Failed to find the command \""+ command + "\".").then(message => {message.delete({timeout: 1000})}).catch(O_o => { });
        }

        //if (!client.servercommands.has(command)) return;

        if (!cooldowns.has(dmcommand.name)) {
            cooldowns.set(dmcommand.name, new discord.Collection());
        }
        
        const now = Date.now();
        const timestamps = cooldowns.get(commandcontent.name);
        // Sets the cooldown time
        var cooldownAmount;
        if (commandcontent.cooldown == "none" || commandcontent.cooldown == 0){
            cooldownAmount = 0;
        }
        else {
            cooldownAmount = (commandcontent.cooldown || 3)* 1000;
        }
        
        if (timestamps.has(message.author.id)) {
            // ...
        }

        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
        
            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${commandcontent.name}\` command.`);
            }
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

        // If a command is present, execute it
        
        try {
            commandcontent.execute(message, args);
        } catch (error) {
            console.error(error);
            message.reply('there was an error trying to execute that command!');
        }
    }

    // Executes if a message is sent in a guild (most)    
    else if (guild != null) {
        // Get prefix
        const prefix = await databaseproxy.get(guild.id, "prefix");
        // Get moderator role
        //const modrole = await databaseproxy.get(guild.id, "modrole");

        // Here we separate our "command" name, and our "arguments" for the command. 
        // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
        // args = ["Is", "this", "the", "real", "life?"]
        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        // command = say   
        const command = args.shift().toLowerCase();
        const messageasargs = message.content.trim().split(/ +/g);

        // Get default word filter setting
        const guildwordfilter = "bannedwords.txt";

        // dontsay : variable to let bot send message
        global.dontsay = 200;
        // checks if you have the role to bypass the filter (by default them mod role)
        //if (!message.member.roles.cache.some(r => [modrole].includes(r.name))) {
        // For each banned word, 

        if (await databaseproxy.get(guild.id, "filterlanguage")) {
            // Checks messages against the default word filter
            if (await databaseproxy.get(guild.id, "filterlanguage_level") != "custom") {
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
        };

        const commandcontent = client.servercommands.get(command) || client.servercommands.find(cmd => cmd.aliases && cmd.aliases.includes(command));
        
        // Stop uncalled for replies
        if (!message.content.startsWith(prefix)) {
            return;
        }

        if (!commandcontent) {
            return message.reply("Failed to find the command \""+ command + "\".").then(message => {message.delete({timeout: 1000})}).catch(O_o => { });
        }
        //if (!client.servercommands.has(command)) return;
    

        // Manages the command cooldowns
        if (!cooldowns.has(commandcontent.name)) {
            cooldowns.set(commandcontent.name, new discord.Collection());
        }
        // Gets the  current date and the command's cooldown time in ms
        const now = Date.now();
        const timestamps = cooldowns.get(commandcontent.name);
        
        // Sets the cooldown time
        var cooldownAmount;
        if (commandcontent.cooldown == "none" || commandcontent.cooldown == 0){
            cooldownAmount = 0;
        }
        else {
            cooldownAmount = (commandcontent.cooldown || 3)* 1000;
        }
        

        if (timestamps.has(message.author.id)) {
            // ...
        }

        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
            // Checks if the expiry time for the cooldown has passed
            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${commandcontent.name}\` command.`);
            }
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

        // If a command is present, execute it
        
        try {
            commandcontent.execute(client, message, args);
        } catch (error) {
            console.error(error);
            message.reply('there was an error trying to execute that command!');
        }
    }
});

client.login(process.env.token);