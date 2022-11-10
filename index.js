import fs from "fs";

import global from "./global.js";

import Database from "./app/Database.js";
import Server from "./app/Server.js";

const argument = process.argv.find((x) => x.toLowerCase().startsWith("config="));

global.config = JSON.parse(fs.readFileSync("./server/config.json"));

import "./app/API.js";
import "./app/Playback.js";

(async () => {
    await Database.connectAsync(global.config.database);

    Server.listen(global.config.server);
})();
