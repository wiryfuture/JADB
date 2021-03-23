import { readdirSync } from "fs"
export const loadCommands = () => {
    let commands = new Map()

    const commandfiles = readdirSync(`${process.cwd()}/source/commands`).filter(file => file.endsWith('.ts'))
    for (const file of commandfiles) {
        const c = require(`${process.cwd()}/source/commands/${file}`)
        commands.set(c.name, c)
    }
    return commands
}