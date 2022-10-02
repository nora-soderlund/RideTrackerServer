import fs from "fs";

import Server from "../../Server.js";
import Database from "../../Database.js";

Server.on("GET", "/api/activity/comments", async (request, response, parameters) => {
    const rows = await Database.queryAsync(`SELECT id FROM activity_comments WHERE activity = ${Database.connection.escape(parameters.activity)} ORDER BY timestamp DESC`);

    return {
        success: true,
        content: rows.map((row) => row.id)
    };
}, [ "activity" ]);
