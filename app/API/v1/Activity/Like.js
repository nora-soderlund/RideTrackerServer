import { v4 as uuidv4 } from "uuid";

import Server from "./../../../Server.js";
import Database from "./../../../Database.js";

Server.on("POST", "/api/activity/like", async (request, response, parameters) => {
    if(request.user.guest)
        return { success: false };

    const rows = await Database.queryAsync(`SELECT * FROM activity_likes WHERE activity = ${Database.connection.escape(parameters.activity)} AND user = ${Database.connection.escape(request.user.id)}`);

    if(rows.length) {
        const row = rows[0];

        await Database.queryAsync(`DELETE FROM activity_likes WHERE id = ${Database.connection.escape(row.id)}`);

        return {
            success: true,
            content: false
        };
    }

    const id = uuidv4();
    const timestamp = new Date(Date.now()).getTime();

    await Database.queryAsync(`INSERT INTO activity_likes (id, activity, user, timestamp) VALUES (${Database.connection.escape(id)}, ${Database.connection.escape(parameters.activity)}, ${Database.connection.escape(request.user.id)}, ${Database.connection.escape(timestamp)})`);

    return {
        success: true,
        content: true
    };
}, [ "activity", "like" ]);

Server.on("GET", "/api/activity/like", async (request, response, parameters) => {
    if(request.user.guest)
        return { success: false };

    const rows = await Database.queryAsync(`SELECT * FROM activity_likes WHERE activity = ${Database.connection.escape(parameters.activity)} AND user = ${Database.connection.escape(request.user.id)}`);

    return {
        success: true,
        content: (!!rows.length)
    };
}, [ "activity", "like" ]);
