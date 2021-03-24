import mongoose from "mongoose"
const { Schema, model } = mongoose

// Server Schema
const serverschema = new Schema({
    uuid: {type: String},
    datejoined: {type: Date, default: Date.now},
    prefix: {type: String, default: "!"},
    logging: {type: Boolean, default: false},
    logging_channel: {type: String, default: ""},
    modrole: {type: String, default: "Moderator"},
    dowelcomemessage: {type: Boolean, default: false},
    welcome_channel: {type: String, default: ""},
    welcome_message: {type: String, default: "Say hello to {{user}}!"}
})

export const servermodel = model("servers", serverschema)