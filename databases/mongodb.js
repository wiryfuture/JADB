const config = require('dotenv').config();
const mongoose = require("mongoose");

// Server Schema
var serverschema = new mongoose.Schema({
    serveruuid: String,
    datejoined: {type: Date, default: Date.now},
    prefix: {type: String, default: "!"},
    logging: {type: Boolean, default: false},
    logging_channel: {type: String, default: ""},
    modrole: {type: String, default: "Moderator"},
    dowelcomemessage: {type: Boolean, default: false},
    welcome_channel: {type: String, default: ""},
    welcome_message: {type: String, default: "Say hello to {{user}}!"},
    filterlanguage: {type: Boolean, default: false},
    filterlanguage_level: {type: String, default: "slurs"},
    filterlanguage_custom: {type: Array, default: "frick"}
});
// Server model (for CRUD)
var servermodel = mongoose.model("server", serverschema);

module.exports = {
    upload: function() {

    },
    get: async function(uuid, setting) {
        // Connects to db
        return new Promise((resolve, reject) => {
            mongoose.connect(process.env.databaseurl, { useNewUrlParser: true, useUnifiedTopology: true });
            mongoose.connection.on('error', console.error.bind(console, "\n   - - - MongoDB connection error! - - -\n"));
            mongoose.connection.once("open", function () {
                // Finds the server with provided uuid and returns the piece of data that was requested
                servermodel.findOne({ serveruuid: [uuid] }, setting, function (err, data) {
                    mongoose.disconnect();
                    if (err) reject(err);
                    else {
                        resolve(data[setting]);
                    }
                });
            });
        });
    },
    getall: async function(uuid) { // Avoid use if possible for smaller memory footprint
        // Connects to db
        return new Promise((resolve, reject) => {
            mongoose.connect(process.env.databaseurl, { useNewUrlParser: true, useUnifiedTopology: true });
            mongoose.connection.on('error', console.error.bind(console, "\n   - - - MongoDB connection error! - - -\n"));
            mongoose.connection.once("open", function () {
                // Finds the server with provided uuid and returns all the data available (avoid use if possible)
                servermodel.findOne({ serveruuid: [uuid] }, function (err, data) {
                    mongoose.disconnect();
                    if (err) reject(err);
                    else {
                        resolve(data);
                    }
                });
            });
        });
    },
    newserver: async function(uuid) {
        return new Promise((resolve, reject) => {
            // Connect to db
            mongoose.connect(process.env.databaseurl, { useNewUrlParser: true, useUnifiedTopology: true });
            mongoose.connection.on('error', console.error.bind(console, "\n   - - - MongoDB connection error! - - -\n"));
            mongoose.connection.once("open", function () {
                // creates new entry under server with server uuid and defaults
                var genericserverdoc = new servermodel({serveruuid : uuid})
                genericserverdoc.save(function (err) {
                    mongoose.disconnect();
                    if (err) reject(err);
                    else resolve(1);
                });
            });
        });
    }
}
