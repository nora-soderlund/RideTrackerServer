import Server from "./../../Server.js";
import Database from "./../../Database.js";

import global from "./../../../global.js";

Server.on("GET", "/api/v1/user", { parameters: [ "id" ] }, async (request, response, parameters) => {
    const row = await Database.querySingleAsync(`SELECT * FROM users WHERE id = ${Database.connection.escape(parameters.id)} LIMIT 1`);
    
    if(!row)
        return { success: false };

    return {
        success: true,

        content: {
            id: row.id,
            slug: row.slug,
            name: row.firstname + " " + row.lastname,
            avatar: global.config.server.domain + "/avatars/" + (row.avatar ?? "default.jpg")
        }
    };
});

Server.on("DELETE", "/api/v1/user", { authenticated: true }, async (request, response) => {
    await Database.queryAsync(`UPDATE users SET deleted = true WHERE id = ${Database.connection.escape(request.user.id)}`);

    return { success: true };
});
