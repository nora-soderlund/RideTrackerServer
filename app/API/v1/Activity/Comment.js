import { v4 as uuidv4 } from "uuid";

import Server from "./../../../Server.js";
import Database from "./../../../Database.js";

Server.on("POST", "/api/v1/activity/comment", async (request, response, parameters) => {
    const id = uuidv4();
    const timestamp = new Date(Date.now()).getTime();

    await Database.queryAsync(`INSERT INTO activity_comments (id, activity, parent, user, text, timestamp) VALUES (${Database.connection.escape(id)}, ${Database.connection.escape(parameters.activity)}, ${Database.connection.escape(parameters.parent)}, ${Database.connection.escape("830240ed-a42d-4f3b-86f3-d36ac1a07211")}, ${Database.connection.escape(parameters.text)}, ${Database.connection.escape(timestamp)})`);

    return {
        success: true,
        content: id
    };
}, [ "activity", "text" ]);

Server.on("GET", "/api/v1/activity/comment", async (request, response, parameters) => {
    const rows = await Database.queryAsync(`SELECT * FROM activity_comments WHERE id = ${Database.connection.escape(parameters.comment)}`);

    return {
        success: true,
        content: (rows.length)?(rows[0]):(null)
    };
}, [ "comment" ]);
