import Server from "./../../../Server.js";
import Database from "./../../../Database.js";

Server.on("GET", "/api/v1/user/routes", { parameters: [ "user" ] }, async (request, response, parameters) => {
    const rows = await Database.queryAsync(`SELECT id FROM routes WHERE user = ${Database.connection.escape(parameters.user)} ORDER BY timestamp DESC`);

    return {
        success: true,
        content: rows.map((route) => route.id)
    };
}); 
