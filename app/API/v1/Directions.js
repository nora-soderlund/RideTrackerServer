import fs from "fs";

import polylineCodec from "@googlemaps/polyline-codec";
const { decode } = polylineCodec;

import global from "./../../../global.js";

import Server from "./../../Server.js";
import Database from "./../../Database.js"

Server.on("GET", "/api/v1/directions", { parameters: [ "directions" ] }, async (request, response, parameters) => {
    const row = await Database.querySingleAsync(`SELECT * FROM directions WHERE id = ${Database.connection.escape(parameters.directions)} LIMIT 1`);
    
    if(!row)
        return { success: false };

    const path = `${global.config.paths.directions}${row.id}.json`;

    if(!fs.existsSync(path))
        return { success: false };

    const content = fs.readFileSync(path);

    const directions = JSON.parse(content);

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
});
