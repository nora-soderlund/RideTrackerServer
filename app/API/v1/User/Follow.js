import { v4 as uuidv4 } from "uuid";

import Server from "./../../../Server.js";
import Database from "./../../../Database.js";

Server.on("POST", "/api/v1/user/follow", { authenticated: true, parameters: [ "user" ] }, async (request, response, parameters) => {
    const row = await Database.querySingleAsync(`SELECT * FROM users WHERE id = ${Database.connection.escape(parameters.user)}`);

    if(!row)
        return { success: false };

    const follow = await Database.querySingleAsync(`SELECT * FROM user_follows WHERE user = ${Database.connection.escape(request.user.id)} AND follow = ${Database.connection.escape(row.id)}`);

    if(!follow) {
        const id = uuidv4() + ".png";

        await Database.queryAsync(`INSERT INTO user_follows (id, user, follow, timestamp) VALUES (${Database.connection.escape(id)}, ${Database.connection.escape(request.user.id)}, ${Database.connection.escape(row.id)}, ${Database.connection.escape(Date.now())})`);

        return { success: true, content: true };
    }

    await Database.queryAsync(`DELETE FROM user_follows WHERE id = ${Database.connection.escape(follow.id)}`);

    return { success: true, content: false };
});

Server.on("GET", "/api/v1/user/follow", { authenticated: true, parameters: [ "user" ] }, async (request, response, parameters) => {
    const row = await Database.querySingleAsync(`SELECT * FROM users WHERE id = ${Database.connection.escape(parameters.user)}`);

    if(!row)
        return { success: false };

    const followRows = await Database.queryAsync(`SELECT * FROM user_follows WHERE user = ${Database.connection.escape(request.user.id)} AND follow = ${Database.connection.escape(row.id)}`);

    return { success: true, content: !!followRows.length };
});
