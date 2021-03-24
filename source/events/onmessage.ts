import { Client, Message } from "discord.js"
import { servermodel } from "../schemas/server"

export const onMessage = async (client: Client, commands:Map<string, any>, message: Message) => {
    if (message.author.bot) return

    // Get prefix from db or use default
    const prefix = (message.guild.id) ? (await servermodel.findOne({ uuid: message.guild.id})).prefix : "!"
    if (!message.content.startsWith(prefix)) return // don't care about stuff not aimed at the bot
    
    const args: Array<any> = message.content.slice(prefix.length).trim().split(/ +/g);
    const commandName = args.shift().toLowerCase();
    const command = commands.get(commandName) || commands.forEach(
        cmd => {if (cmd.aliases.includes(commandName)) return cmd } 
    )        

    // Executes the command given by the issuer
    try {
        command.execute(client, message, args);
    } catch (error) {
        // Tells the user if the command failed to run
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
}