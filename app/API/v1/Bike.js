import global from "./../../../global.js";

import Server from "./../../Server.js";
import Database from "./../../Database.js";

Server.on("GET", "/api/bike", async (request, response, parameters) => {
    const rows = await Database.queryAsync(`SELECT * FROM bikes WHERE id = ${Database.connection.escape(parameters.bike)} LIMIT 1`);
    
    if(rows.length == 0)
        return { success: false };

    const row = rows[0];

    return {
        success: true,

        content: {
            user: row.user,
            name: row.name,
            image: global.config.server.domain + "/" + (row.image ?? "defaults/bike.png"),
            brand: row.brand,
            model: row.model,
            year: row.year,
            type: row.type
        }
    };
}, [ "bike" ]);
