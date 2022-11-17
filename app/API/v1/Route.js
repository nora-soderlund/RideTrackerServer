import Server from "./../../Server.js";
import Database from "./../../Database.js";

Server.on("GET", "/api/v1/route", { parameters: [ "route" ] }, async (request, response, parameters) => {
    const row = await Database.querySingleAsync(`SELECT * FROM routes WHERE id = ${Database.connection.escape(parameters.route)} LIMIT 1`);
    
    if(!row)
        return { success: false };

    return {
        success: true,

        content: {
            id: row.id,
            user: row.user,
            name: row.name,
            directions: row.directions,
            timestamp: row.timestamp
        }
    };
});
