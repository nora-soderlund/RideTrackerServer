import fs from "fs";

import polylineCodec from "@googlemaps/polyline-codec";
const { decode } = polylineCodec;

import global from "./../../../global.js";

import Server from "./../../Server.js";
import Database from "./../../Database.js"

Server.on("GET", "/api/v1/directions", async (request, response, parameters) => {
    const rows = await Database.queryAsync(`SELECT * FROM directions WHERE id = ${Database.connection.escape(parameters.directions)} LIMIT 1`);
    
    if(rows.length == 0)
        return { success: false };

    const row = rows[0];

    const directions = JSON.parse(fs.readFileSync(`./documents/directions/${row.id}.json`));

    const sections = directions.routes.map((route) => {
        return decode(route.overview_polyline.points, 5).map((points) => { return { latitude: points[0], longitude: points[1] } });
    });

    return {
        success: true,

        content: {
            id: row.id,
            sections,
            summary: row.summary,
            distance: row.distance,
            duration: row.duration
        }
    };
}, [ "directions" ]);
