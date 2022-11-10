import fs from "fs";

import global from "./global.js";

import Database from "./app/Database.js";
import Server from "./app/Server.js";

global.config = JSON.parse(fs.readFileSync("./server/config.json"));

for(let key in global.config.paths) {
    if(!fs.existsSync(global.config.paths[key])) {
        console.warn(`WARNING! Path ${key} doesn't exist, creating it...`);

        fs.mkdirSync(global.config.paths[key], { recursive: true });
    }
}

import "./app/API.js";
import "./app/Playback.js";

(async () => {
    await Database.connectAsync(global.config.database);

    Server.listen(global.config.server);
})();
