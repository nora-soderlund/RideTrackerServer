import fs from "fs";

import Server from "../../Server.js";
import Database from "../../Database.js";

import Recording from "../../Data/Recording.js";

Server.on("GET", "/api/activity/map", async (request, response, parameters) => {
    const rows = await Database.queryAsync(`SELECT * FROM activities WHERE id = ${Database.connection.escape(parameters.id)} LIMIT 1`);

    if(rows.length == 0) {
        return {
            success: false,
            content: "No activity found!"
        };
    }

    const row = rows[0];

    const recording = new Recording(row.id);
    const manifest = await recording.getManifest();

    return {
        success: true,
        content: manifest
    };
}, [ "id" ]);
