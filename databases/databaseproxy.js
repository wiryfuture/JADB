const config = require("dotenv").config();
// Each type of database should have its own file below, referenced in each function
const mongodbmethods = require("./mongodb.js");

//Each standardised function should be here. Every function should return the same data, no matter what database is used. This should be done in each of the database scripts.
// If no database is present, the promise will reject.
// As to avoid confusion, the promise will reject if the database chosen doesn't support the function/feature.
module.exports = {
    newserver: async function(uuid){
        return new Promise((resolve, reject) => {
            switch(process.env.databasetype.toLowerCase()) {
                // Checks if no database is selected.
                case null:
                    reject("No database selected.");
                // Check if the database selected is mongodb, if then use mongodb function.
                case "mongodb":
                    resolve(mongodbmethods.newserver(uuid));
                //  Assume that if the given database isn't listed, it does not support the function/feature.
                default:
                    reject("Not supported by current database.");  
            }
        }); 
    },
    get: async function(uuid, setting){
        return new Promise((resolve, reject) => {
            switch(process.env.databasetype.toLowerCase()) {
                // Checks if no database is selected.
                case null:
                    reject("No database selected.");
                // Check if the database selected is mongodb, if then use mongodb function.
                case "mongodb":
                    resolve(mongodbmethods.get(uuid,setting));
                //  Assume that if the given database isn't listed, it does not support the function/feature.
                default:
                    reject("Not supported by current database.");  
            }
        });
    },
    getall: async function(uuid){
        return new Promise((resolve, reject) => {
            switch(process.env.databasetype.toLowerCase()) {
                // Checks if no database is selected.
                case null:
                    reject("No database selected.");
                // Check if the database selected is mongodb, if then use mongodb function.
                case "mongodb":
                    resolve(mongodbmethods.getall(uuid));
                //  Assume that if the given database isn't listed, it does not support the function/feature.
                default:
                    reject("Not supported by current database.");  
            }
        });
    },
    deleteserver: async function(uuid){
        return new Promise((resolve, reject) => {
            switch(process.env.databasetype.toLowerCase()) {
                // Checks if no database is selected.
                case null:
                    reject("No database selected.");
                // Check if the database selected is mongodb, if then use mongodb function.
                case "mongodb":
                    resolve(mongodbmethods.deleteserver(uuid));
                //  Assume that if the given database isn't listed, it does not support the function/feature.
                default:
                    reject("Not supported by current database.");  
            }
        })
    }

}