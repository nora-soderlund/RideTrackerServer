import Server from "./../../Server.js";
import Database from "./../../Database.js";

Server.on("GET", "/api/v1/activity", async (request, response, parameters) => {
    const rows = await Database.queryAsync(`SELECT * FROM activities WHERE id = ${Database.connection.escape(parameters.id)} LIMIT 1`);

    if(rows.length == 0)
        return { success: false, content: "No activity found!" };

    const row = rows[0];

    return {
        success: true,
        content: {
            id: row.id,
            user: row.user,
            title: row.title,
            description: row.description,
            outdated: row.outdated,
            bike: row.bike,
            timestamp: row.timestamp
        }
    };
}, [ "id" ]);

Server.on("DELETE", "/api/v1/activity", async (request, response, parameters) => {
    if(request.user.guest)
        return { success: false };

    const rows = await Database.queryAsync(`SELECT * FROM activities WHERE id = ${Database.connection.escape(parameters.activity)} LIMIT 1`);

    if(rows.length == 0)
        return { success: false };

    const row = rows[0];

    if(row.user != request.user.id)
        return { success: false };

    await Database.queryAsync(`DELETE FROM activities WHERE id = ${Database.connection.escape(row.id)}`);

    return {
        success: true
    };
}, [ "activity" ]);
