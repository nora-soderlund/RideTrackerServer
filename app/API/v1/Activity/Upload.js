import fs from "fs";
import { v4 as uuidv4 } from "uuid";

import Server from "./../../../Server.js";
import Database from "./../../../Database.js";

import global from "./../../../../global.js";

Server.on("POST", "/api/v1/activity/upload", { authenticated: true, parameters: [ "recording" ], optionalParameters: [ "title", "description", "bike" ] }, async (request, response, body) => {
    const id = uuidv4();

    await Database.queryAsync(`INSERT INTO activities (id, user, title, description, bike, timestamp) VALUES (${Database.connection.escape(id)}, ${Database.connection.escape(request.user.id)}, ${Database.connection.escape(body.title)}, ${Database.connection.escape(body.description)}, ${Database.connection.escape(body.bike)}, ${Database.connection.escape(Date.now())})`);
    
    fs.writeFileSync(global.config.paths.activities + `${id}.json`, JSON.stringify(body.recording));
    
    return {
        success: true,
        content: { // ?
            activity: id
        }
    };
});
