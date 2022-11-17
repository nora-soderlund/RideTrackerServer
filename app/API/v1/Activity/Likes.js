import Server from "./../../../Server.js";
import Database from "./../../../Database.js";

Server.on("GET", "/api/v1/activity/likes", { parameters: [ "activity" ] }, async (request, response, parameters) => {
    const row = await Database.querySingleAsync(`SELECT COUNT(*) as count FROM activity_likes WHERE activity = ${Database.connection.escape(parameters.activity)}`);

    if(!row)
        return { success: false };

    return {
        success: true,
        content: row.count
    };
});
