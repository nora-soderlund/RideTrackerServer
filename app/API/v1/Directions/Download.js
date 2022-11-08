import fs from "fs";

import polylineCodec from "@googlemaps/polyline-codec";
const { decode } = polylineCodec;

import Server from "./../../../Server.js";
import Database from "./../../../Database.js";

Server.on("GET", "/api/v1/directions/download", async (request, response, parameters) => {
    const rows = await Database.queryAsync(`SELECT * FROM directions WHERE id = ${Database.connection.escape(parameters.directions)} LIMIT 1`);
    
    if(rows.length == 0)
        return { success: false };

    const row = rows[0];

    const directions = JSON.parse(fs.readFileSync(`./documents/directions/${row.id}.json`));

    return {
        success: true,

        content: directions
    };
}, [ "directions" ]);
