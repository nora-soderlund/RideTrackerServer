import JsonMessage from "@nora-soderlund/json-messages";

import Server from "./../../Server.js";
import Database from "./../../Database.js";
import Manifest from "./../../Manifest.js";

Manifest.register("/api/v1/activity", "object", [ "id", "user", "title", "description", "outdated", "bike", "timestamp" ]);

Server.on("GET", "/api/v1/activity", { parameters: [ "id" ] }, async (request, response, parameters) => {
    const row = await Database.querySingleAsync(`SELECT * FROM activities WHERE id = ${Database.connection.escape(parameters.id)} LIMIT 1`);

    if(!row)
        return { success: false };

    /*return {
        success: true,
        content: {
            id: row.id,
            user: row.user,
            title: row.title,
            description: row.description,
            outdated: row.outdated,
            bike: row.bike,
            timestamp: row.timestamp
        }
    };*/

    return JsonMessage.compressWithoutHeader(Manifest.structures, "/api/v1/activity", {
        id: row.id,
        user: row.user,
        title: row.title,
        description: row.description,
        outdated: row.outdated,
        bike: row.bike,
        timestamp: row.timestamp
    });
});

Server.on("DELETE", "/api/v1/activity", { authenticated: true, parameters: [ "activity" ] }, async (request, response, parameters) => {
    const rows = await Database.queryAsync(`SELECT * FROM activities WHERE id = ${Database.connection.escape(parameters.activity)} LIMIT 1`);

    if(rows.length == 0)
        return { success: false };

    const row = rows[0];

    if(row.user != request.user.id)
        return { success: false };

    await Database.queryAsync(`DELETE FROM activities WHERE id = ${Database.connection.escape(row.id)}`);

    return {
        success: true
    };
});
