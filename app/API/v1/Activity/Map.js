import fs from "fs";

import Server from "./../../../Server.js";
import Database from "./../../../Database.js";

import global from "./../../../../global.js";

import Recording from "./../../../Data/Recording.js"

Server.on("GET", "/api/v1/activity/map", { parameters: [ "id" ] }, async (request, response, parameters) => {
    const row = await Database.querySingleAsync(`SELECT * FROM activities WHERE id = ${Database.connection.escape(parameters.id)} LIMIT 1`);

    if(!row)
        return { success: false };

    const path = `${global.config.paths.activities}${row.id}.json`;

    if(!fs.existsSync(path))
        return { success: false };

    const recording = new Recording(row.id);
    const manifest = await recording.getManifest();

    return {
        success: true,
        content: manifest
    };
});
