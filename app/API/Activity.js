import Server from "../Server.js";
import Database from "../Database.js";

Server.on("GET", "/api/activity", async (request, response, parameters) => {
    const rows = await Database.queryAsync(`SELECT * FROM activities WHERE id = ${Database.connection.escape(parameters.id)} LIMIT 1`);

    if(rows.length == 0)
        return { success: false, content: "No activity found!" };

    const row = rows[0];

    return {
        success: true,
        content: {
            id: row.id,
            user: row.user,
            bike: row.bike,
            timestamp: row.timestamp
        }
    };
}, [ "id" ]);
