import fs from "fs";

import Server from "../../Server.js";
import Database from "../../Database.js";

Server.on("GET", "/api/activity/comments", async (request, response, parameters) => {
    const rows = await Database.queryAsync(`SELECT * FROM activity_comments WHERE activity = ${Database.connection.escape(parameters.activity)} LIMIT 1`);

    return {
        success: true,
        content: rows.map((row) => {
            return {
                id: row.id,
                user: row.user,
                text: row.text,
                timestamp: row.timestamp
            }
        })
        
    };
}, [ "activity" ]);
