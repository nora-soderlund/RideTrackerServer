import global from "./../../../global.js";

import Server from "./../../Server.js";
import Database from "./../../Database.js";

Server.on("GET", "/api/v1/bike", { parameters: [ "bike" ] }, async (request, response, parameters) => {
    const row = await Database.querySingleAsync(`SELECT * FROM bikes WHERE id = ${Database.connection.escape(parameters.bike)} LIMIT 1`);
    
    if(!row)
        return { success: false };

    return {
        success: true,

        content: {
            user: row.user,
            name: row.name,
            image: global.config.server.domain + "/bikes/" + (row.image ?? "default.png"),
            brand: row.brand,
            model: row.model,
            year: row.year,
            type: row.type
        }
    };
});
