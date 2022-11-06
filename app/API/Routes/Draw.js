import global from "../../../global.js";
import { v4 as uuidv4 } from "uuid";

import fs from "fs";

import Server from "../../Server.js";
import Database from "../../Database.js";

import { Directions, Roads, Geocoding } from "./../../Google/Google.js";

Server.on("POST", "/api/routes/draw", async (request, response, body) => {
    let places = [];

    for(let index = 0; index < body.coordinates.length; index++) {
        const result = await Geocoding.reverse(body.coordinates[index]);

        if(result.results.length == 0)
            continue;

        places.push(result.results[0].place_id);
    }

    const directions = await Directions(body.origin.latitude + "," + body.origin.longitude, body.destination.latitude + "," + body.destination.longitude, {
        waypoints: places.map((place) => `place_id:${place}`).join('|'),
        avoid: "tolls|highways|ferries|indoor",
        mode: "bicycling"
    });

    const id = uuidv4();

    const name = "tba";

    await Database.queryAsync(`INSERT INTO routes (id, user, name, timestamp) VALUES (${Database.connection.escape(id)}, ${Database.connection.escape(request.user.id)}, ${Database.connection.escape(name)}, ${Database.connection.escape(Date.now())})`);

    fs.writeFileSync(`./documents/directions/${id}.json`, JSON.stringify(directions));

    return {
        success: true,

        content: id
    };
}, [ "coordinates", "origin", "destination" ]);
