export const OnMessage = async (client:any , prefix: string, message: any) => {
    if (message.author.bot) return
    if (!message.content.startsWith(prefix)) return
    
    const args: Array<any> = message.content.slice(prefix.length).trim().split(/ +/g);
    const commandName = args.shift().toLowerCase();
    
    if (commandName == "ping") {
        message.delete()
        const m = await message.channel.send("Ping?")
        m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`)
    }

    if (commandName == "pog") {
        message.reply("poggers")
    }
}