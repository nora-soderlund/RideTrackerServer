import Server from "./../../../Server.js";
import Database from "./../../../Database.js";

Server.on("GET", "/api/v1/activity/likes", async (request, response, parameters) => {
    const rows = await Database.queryAsync(`SELECT COUNT(*) as count FROM activity_likes WHERE activity = ${Database.connection.escape(parameters.activity)}`);

    if(!rows.length) {
        return {
            success: false
        };
    }

    return {
        success: true,
        content: rows[0].count
    };
}, [ "activity" ]);
