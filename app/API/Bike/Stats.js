import fs from "fs";

import Server from "../../Server.js";
import Database from "../../Database.js";


Server.on("GET", "/api/bike/stats", async (request, response, parameters) => {
    const bikes = await Database.queryAsync(`SELECT * FROM bikes WHERE id = ${Database.connection.escape(parameters.id)} LIMIT 1`);

    if(bikes.length == 0)
        return { success: false };

    const bike = bikes[0];
    
    const rows = await Database.queryAsync(`SELECT COUNT(id) AS rides, SUM(\`distance\`) AS \`distance\`, SUM(elevation) AS elevation FROM activities WHERE bike = ${Database.connection.escape(bike.id)}`);
    
    if(rows.length == 0)
        return { success: false };

    const row = rows[0];

    return {
        success: true,
        content: {
            rides: row.rides,
            distance: Math.round(row.distance) ?? 0,
            elevation: Math.round(row.elevation) ?? 0
        }
    };
}, [ "id" ]);
