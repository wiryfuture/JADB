import { Client, Message } from "discord.js";

declare module commands {
    export async function execute(client: Client, message: Message, args: Array<String>): Promise<any>;
}