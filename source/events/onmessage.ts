import { Client, Message } from "discord.js"
import { servermodel } from "../schemas/server"

export const onMessage = async (client: Client, commands:Map<string, any>, message: Message, cooldowns: Map<String, any>) => {
    if (message.author.bot) return

    // Get prefix from db or use default
    const prefix = (message.guild.id) ? (await servermodel.findOne({ uuid: message.guild.id})).prefix : "!"
    if (!message.content.startsWith(prefix)) return // don't care about stuff not aimed at the bot
    
    const args: Array<any> = message.content.slice(prefix.length).trim().split(/ +/g);
    const commandName = args.shift().toLowerCase();
    const command = commands.get(commandName) || commands.forEach(
        cmd => {if (cmd.aliases.includes(commandName)) return cmd } 
    )        

    // Stop running the command if it's in a dm and that isn't allowed
    if (command.guildonly && message.guild.id) {
        return message.reply("This command can only be run in guilds, sry.")
    }

    // Check cooldowns
    if (!cooldowns.has(command.name)) { cooldowns.set(command.name, new Map())}
    const now = Date.now()
    const timestamps =  cooldowns.get(command.name)
    let cooldownamount: number = command.cooldown * 1000 // cooldown should be in seconds
    if (timestamps.has(message.author.id)) {
        const expirationtime = timestamps.get(message.author.id) + cooldownamount
        if (now < expirationtime) {
            const timeleft = (expirationtime - now) /1000
            message.delete()
            return message.reply(`You need to wait ${timeleft.toFixed(1)}s before issuing this command again!`)
                .then(message => {message.delete({timeout: 2000})})
        }
    }
    timestamps.set(message.author.id, now)
    setTimeout(() => timestamps.delete(message.author.id), cooldownamount)
    // Executes the command given by the issuer
    try {
        command.execute(client, message, args);
    } catch (error) {
        // Tells the user if the command failed to run
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
}
