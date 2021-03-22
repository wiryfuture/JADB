export const onMessage = async (client:any , prefix: string, commands:Map<string, any>, message: any) => {
    if (message.author.bot) return
    if (!message.content.startsWith(prefix)) return
    
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

    if (commandName == "pog") {
        message.reply("poggers")
    }
}