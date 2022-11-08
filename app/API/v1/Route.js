

import polylineCodec from "@googlemaps/polyline-codec";
const { decode } = polylineCodec;

import global from "./../../../global.js";

import Server from "./../../Server.js";
import Database from "./../../Database.js";

Server.on("GET", "/api/v1/route", async (request, response, parameters) => {
    const rows = await Database.queryAsync(`SELECT * FROM routes WHERE id = ${Database.connection.escape(parameters.route)} LIMIT 1`);
    
    if(rows.length == 0)
        return { success: false };

    const row = rows[0];

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
}, [ "route" ]);
