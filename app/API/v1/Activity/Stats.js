

import Server from "./../../../Server.js";
import Database from "./../../../Database.js";

import Recording from "./../../../Data/Recording.js"

Server.on("GET", "/api/v1/activity/stats", async (request, response, parameters) => {
    let rows = await Database.queryAsync(`SELECT * FROM activities WHERE id = ${Database.connection.escape(parameters.id)} LIMIT 1`);

    if(rows.length == 0)
        return { success: false };

    let row = rows[0];

    if(row.manifest != Recording.version) {
        // if we need to update the manifest to a newer version

        const recording = new Recording(row.id);
        await recording.getManifest();

        const distance = recording.getDistance();
        const speed = recording.getSpeed();
        const elevation = recording.getElevation();

        const origin = await recording.getOrigin();
        const destination = await recording.getDestination();

        console.log({ origin, destination });

        await Database.queryAsync(`UPDATE activities SET distance = ${Database.connection.escape(distance)}, speed = ${Database.connection.escape(speed)}, elevation = ${Database.connection.escape(elevation)}, origin = ${Database.connection.escape(origin)}, destination = ${Database.connection.escape(destination)} WHERE id = ${Database.connection.escape(parameters.id)}`);
    }

    rows = await Database.queryAsync(`SELECT * FROM activities WHERE id = ${Database.connection.escape(parameters.id)} LIMIT 1`);
    row = rows[0];

    return {
        success: true,
        content: {
            distance: row.distance,
            speed: row.speed,
            elevation: row.elevation
        }
    };
}, [ "id" ]);
