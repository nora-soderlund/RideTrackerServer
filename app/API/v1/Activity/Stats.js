import fs from "fs";

import Server from "./../../../Server.js";
import Database from "./../../../Database.js";

import global from "./../../../../global.js";

import Recording from "./../../../Data/Recording.js"

Server.on("GET", "/api/v1/activity/stats", { parameters: [ "id" ] }, async (request, response, parameters) => {
    let row = await Database.querySingleAsync(`SELECT * FROM activities WHERE id = ${Database.connection.escape(parameters.id)} LIMIT 1`);

    if(!row)
        return { success: false };

    if(row.manifest != Recording.version) {
        // if we need to update the manifest to a newer version

        const path = `${global.config.paths.activities}${row.id}.json`;

        if(!fs.existsSync(path))
            return { success: false };

        const recording = new Recording(row.id);

        await recording.getManifest();

        const distance = recording.getDistance();
        const speed = recording.getSpeed();
        const elevation = recording.getElevation();

        const origin = await recording.getOrigin();
        const destination = await recording.getDestination();

        await Database.queryAsync(`UPDATE activities SET manifest = ${Database.connection.escape(Recording.version)}, distance = ${Database.connection.escape(distance)}, speed = ${Database.connection.escape(speed)}, elevation = ${Database.connection.escape(elevation)}, origin = ${Database.connection.escape(origin)}, destination = ${Database.connection.escape(destination)} WHERE id = ${Database.connection.escape(parameters.id)}`);
    }

    row = await Database.querySingleAsync(`SELECT * FROM activities WHERE id = ${Database.connection.escape(parameters.id)} LIMIT 1`);

    return {
        success: true,
        content: {
            distance: row.distance,
            speed: row.speed,
            elevation: row.elevation,
            origin: row.origin,
            destination: row.destination
        }
    };
});
