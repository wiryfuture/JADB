const config = require("dotenv").config();
const fs = require('fs');

module.exports = {
    // Generates a new .env file from config options here
    makenew: async function(){
        return new Promise((resolve, reject) => {
            fs.copyFile('./defaultfiles/defaultconfig.txt', '.env', (err) => {
                if (err) throw err;
                resolve(1);
            });
        });
    },
    // Checks if
    checkifrecent: async function(){
        return new Promise((resolve, reject) => {
            // Read both files and store them in arrays, splitting at new lines
            currentenv = fs.readFileSync(".env", {encoding:"utf8"}).split("\r\n");
            defaultenv = fs.readFileSync("./defaultfiles/defaultconfig.txt", {encoding:"utf8"}).split("\r\n");
            // Checks each line on both files against each other for "version" and then what number it is, if default is higher, it is newer
            currentenv.forEach(currentelement => {
                if (currentelement.includes("version")){
                    defaultenv.forEach(defaultelement => {
                        if (defaultelement.includes("version")) {
                            currentversionstring = currentelement.split("=")[1];
                            defaultversionstring = defaultelement.split("=")[1];
                            // Splits the strings for the versions into release/patch/hotfix integers
                            currentrelease = currentversionstring.split(".");
                            defaultrelease = defaultversionstring.split(".");
                            // Checks if the defaultrelease is higher than whatever the config file is right now
                            if ( parseInt(currentrelease[0]) <= parseInt(defaultrelease[0]) && parseInt(currentrelease[1]) <= parseInt(defaultrelease[1]) && parseInt(currentrelease[2]) < parseInt(defaultrelease[2]) ) {
                                console.log("You\'re running an old config file!\n" + currentversionstring + " < " + defaultversionstring);
                                resolve(false);
                            }
                            else {
                                resolve(true);
                            }
                        }
                    });
                }
            });
        });
    },
    update: function() {
        originalconfig = fs.readFileSync(".env", {encoding:"utf8"});
        defaultconfig = fs.readFileSync("./defaultfiles/defaultconfig.txt", {encoding:"utf8"}).split("\r\n");
        // Make an array with each line of the original config
        originalconfigarray = originalconfig.split("\r\n");
        // Find which line has the version number
        const hasversion = (element) => element.includes("version=");
        originalversionlinenum = parseInt(originalconfigarray.findIndex(hasversion));
        // Get current version number
        defaultconfiglinenum = parseInt(defaultconfig.findIndex(hasversion));
        // Replace version number with new one
        originalconfigarray.splice(originalversionlinenum, 1, defaultconfig[defaultconfiglinenum]);
        // Create new string in the correct format using the new config array
        newconfig = originalconfigarray.join("\r\n");
        fs.writeFileSync(".env", newconfig, "utf8");

        // Check if the default config contains all of the default config elements, if one is missing, append it at the end
        defaultconfig.forEach( element => {
            linewithequals = element.split("=")[0]+"=";
            if (!originalconfig.includes(linewithequals)) {
                fs.appendFileSync(".env", "\r\n" + element);
            }
        });
        console.log("Updated config, killing process, awaiting restart.");
        process.exit();
    },
    checkpresence: function() {
        if (process.env.token == "") {
            console.error("No bot token present, please fill.");
            process.exit();
        }
        if (process.env.databaseurl == "") {
            console.error("No databaseurl present, please fill.");
            process.exit();
        }
    }
}