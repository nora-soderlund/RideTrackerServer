import Server from "./../../Server.js";
import Database from "./../../Database.js";

import global from "./../../../global.js";

Server.on("GET", "/api/v1/user", async (request, response, parameters) => {
    const rows = await Database.queryAsync(`SELECT * FROM users WHERE id = ${Database.connection.escape(parameters.id)} LIMIT 1`);
    
    if(rows.length == 0)
        return { success: false };

    return {
        success: true,

        content: {
            id: rows[0].id,
            slug: rows[0].slug,
            name: rows[0].firstname + " " + rows[0].lastname,
            avatar: global.config.server.domain + ((rows[0].avatar)?("/uploads/" + rows[0].avatar):("/avatars/default.jpg"))
        }
    };
});

Server.on("DELETE", "/api/v1/user", async (request, response) => {
    if(request.user.guest)
        return { success: false };

    await Database.queryAsync(`UPDATE users SET deleted = true WHERE id = ${Database.connection.escape(request.user.id)}`);

    return { success: true };
});
