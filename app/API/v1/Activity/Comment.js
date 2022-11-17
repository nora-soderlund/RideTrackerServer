import { v4 as uuidv4 } from "uuid";

import Server from "./../../../Server.js";
import Database from "./../../../Database.js";

Server.on("POST", "/api/v1/activity/comment", { authenticated: true, parameters: [ "activity", "text" ], optionalParameters: [ "parent" ] }, async (request, response, parameters) => {
    const id = uuidv4();
    const timestamp = new Date(Date.now()).getTime();

    await Database.queryAsync(`INSERT INTO activity_comments (id, activity, parent, user, text, timestamp) VALUES (${Database.connection.escape(id)}, ${Database.connection.escape(parameters.activity)}, ${Database.connection.escape(parameters.parent)}, ${Database.connection.escape(request.user.id)}, ${Database.connection.escape(parameters.text)}, ${Database.connection.escape(timestamp)})`);

    return {
        success: true,
        content: id
    };
});

Server.on("GET", "/api/v1/activity/comment", { parameters: [ "comment" ] }, async (request, response, parameters) => {
    const row = await Database.querySingleAsync(`SELECT * FROM activity_comments WHERE id = ${Database.connection.escape(parameters.comment)}`);

    if(!row)
        return { success: false };

    return {
        success: true,
        content: row
    };
});
