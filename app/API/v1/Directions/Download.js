import fs from "fs";

import Server from "./../../../Server.js";
import Database from "./../../../Database.js";

import global from "./../../../../global.js";

Server.on("GET", "/api/v1/directions/download", { parameters: [ "directions" ] }, async (request, response, parameters) => {
    const row = await Database.querySingleAsync(`SELECT * FROM directions WHERE id = ${Database.connection.escape(parameters.directions)} LIMIT 1`);
    
    if(!row)
        return { success: false };

    const path = `${global.config.paths.directions}${row.id}.json`;

    if(!fs.existsSync(path))
        return { success: false };

    const content = fs.readFileSync(path);

    const directions = JSON.parse(content);

    return {
        success: true,

        content: directions
    };
});
