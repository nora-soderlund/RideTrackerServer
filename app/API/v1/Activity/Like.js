import { v4 as uuidv4 } from "uuid";

import Server from "./../../../Server.js";
import Database from "./../../../Database.js";

Server.on("POST", "/api/v1/activity/like", { authenticated: true, parameters: [ "activity" ] }, async (request, response, parameters) => {
    const row = await Database.querySingleAsync(`SELECT * FROM activity_likes WHERE activity = ${Database.connection.escape(parameters.activity)} AND user = ${Database.connection.escape(request.user.id)}`);

    if(row) {
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
});

Server.on("GET", "/api/v1/activity/like", { authenticated: true, parameters: [ "activity" ] }, async (request, response, parameters) => {
    const row = await Database.querySingleAsync(`SELECT * FROM activity_likes WHERE activity = ${Database.connection.escape(parameters.activity)} AND user = ${Database.connection.escape(request.user.id)}`);

    return {
        success: true,
        content: (!!row)
    };
});
