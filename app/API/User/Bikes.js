import Server from "../../Server.js";
import Database from "../../Database.js";

Server.on("GET", "/api/user/bikes", async (request, response, parameters) => {
    const rows = await Database.queryAsync(`SELECT id FROM bikes WHERE user = ${Database.connection.escape(parameters.user)}`);

    return {
        success: true,
        content: rows.map((row) => row.id)
    };
}, [ "user" ]);
