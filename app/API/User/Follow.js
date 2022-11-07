import fs from "fs";
import { v4 as uuidv4 } from "uuid";

import Server from "../../Server.js";
import Database from "../../Database.js";

Server.on("POST", "/api/user/follow", async (request, response, body) => {
    if(request.user.guest)
        return { success: false };

    const rows = await Database.queryAsync(`SELECT * FROM users WHERE id = ${Database.connection.escape(body.user)}`);

    if(!rows.length)
        return { success: false };

    const row = rows[0];

    const followRows = await Database.queryAsync(`SELECT * FROM user_follows WHERE user = ${Database.connection.escape(request.user.id)} AND follow = ${Database.connection.escape(row.id)}`);

    if(!followRows.length) {
        const id = uuidv4() + ".png";

        await Database.queryAsync(`INSERT INTO user_follows (id, user, follow, timestamp) VALUES (${Database.connection.escape(id)}, ${Database.connection.escape(request.user.id)}, ${Database.connection.escape(row.id)}, ${Database.connection.escape(Date.now())})`);

        return { success: true, content: true };
    }

    const followRow = followRows[0];
    
    await Database.queryAsync(`DELETE FROM user_follows WHERE id = ${Database.connection.escape(followRow.id)}`);

    return { success: true, content: false };
});

Server.on("GET", "/api/user/follow", async (request, response, body) => {
    if(request.user.guest)
        return { success: false };

    const rows = await Database.queryAsync(`SELECT * FROM users WHERE id = ${Database.connection.escape(body.user)}`);

    if(!rows.length)
        return { success: false };

    const row = rows[0];

    const followRows = await Database.queryAsync(`SELECT * FROM user_follows WHERE user = ${Database.connection.escape(request.user.id)} AND follow = ${Database.connection.escape(row.id)}`);

    return { success: true, content: (followRows.length) };
});
