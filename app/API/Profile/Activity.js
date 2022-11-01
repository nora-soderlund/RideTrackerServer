import Server from "../../Server.js";
import Database from "../../Database.js";

Server.on("GET", "/api/profile/activity", async (request, response, parameters) => {
    const rows = await Database.queryAsync(`SELECT id FROM activities WHERE user = ${Database.connection.escape(parameters.user)} ORDER BY timestamp DESC`);

    return {
        success: true,
        content: {
            latest: rows[0].id,
            count: rows.length
        }
    };
}, [ "user" ]); 
