import fs from "fs";
import { v4 as uuidv4 } from "uuid";

import Server from "../../Server.js";
import Database from "../../Database.js";

Server.on("GET", "/api/activity/likes", async (request, response, parameters) => {
    const rows = await Database.queryAsync(`SELECT COUNT(*) as count FROM activity_likes WHERE activity = ${Database.connection.escape(parameters.activity)}`);

    if(!rows.length) {
        return {
            success: false
        };
    }

    return {
        success: true,
        content: {
            likes: rows[0].count
        }
    };
}, [ "activity" ]);