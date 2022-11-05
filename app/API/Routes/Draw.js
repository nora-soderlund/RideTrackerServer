import global from "../../../global.js";
import { v4 as uuidv4 } from "uuid";

import fs from "fs";

import Server from "../../Server.js";
import Database from "../../Database.js";

import { Directions, Roads } from "./../../Google/Google.js";

Server.on("POST", "/api/routes/draw", async (request, response, body) => {
    const snappedPoints = await Roads.nearestRoads(body.coordinates);

    const directions = await Directions("place_id:" + snappedPoints[0].placeId, "place_id:" + snappedPoints[snappedPoints.length - 1].placeId, {
        waypoints: snappedPoints.slice(1, -1).map((point) => "place_id:" + point.placeId).join('|'),
        avoid: "tolls|highways|ferries|indoor",
        mode: "bicycling"
    });

    const id = uuidv4();

    await Database.queryAsync(`INSERT INTO routes (id, user, timestamp) VALUES (${Database.connection.escape(id)}, ${Database.connection.escape(request.user.id)}, ${Database.connection.escape(Date.now())})`);

    fs.writeFileSync(`./documents/directions/${id}.json`, JSON.stringify(directions));

    return {
        success: true,

        content: id
    };
}, [ "coordinates" ]);
