import { v4 as uuidv4 } from "uuid";
import fs from "fs";

import { Directions, Geocoding } from "./../../../Google/Google.js";

import Server from "./../../../Server.js";
import Database from "./../../../Database.js";

import global from "./../../../../global.js";

Server.on("POST", "/api/v1/directions/draw", { parameters: [ "coordinates", "origin", "destination" ] }, async (request, response, body) => {
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

    let distance = 0, duration = 0, summaries = [];

    directions.routes.forEach((route) => {
        route.legs.forEach((leg) => {
            distance += leg.distance.value;
            duration += leg.duration.value;
        });


        if(route.summary.length)
            summaries.push(route.summary);
    });

    const summary = (summaries.length)?(summaries.join('-')):("No summary");

    const id = uuidv4();

    await Database.queryAsync(`INSERT INTO directions (id, user, summary, distance, duration, timestamp) VALUES (${Database.connection.escape(id)}, ${Database.connection.escape(request.user.id)}, ${Database.connection.escape(summary)}, ${Database.connection.escape(distance)}, ${Database.connection.escape(duration)}, ${Database.connection.escape(Date.now())})`);

    fs.writeFileSync(global.config.paths.directions + `${id}.json`, JSON.stringify(directions));

    return {
        success: true,

        content: id
    };
});
