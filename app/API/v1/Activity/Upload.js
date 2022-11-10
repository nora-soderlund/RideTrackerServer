import fs from "fs";
import { v4 as uuidv4 } from "uuid";

import Server from "./../../../Server.js";
import Database from "./../../../Database.js";

import global from "./../../../../global.js";

Server.on("PUT", "/api/v1/activity/upload", async (request, response, body) => {
    if(request.user.guest)
        return { success: false };

    const id = uuidv4();

    await Database.queryAsync(`INSERT INTO activities (id, user, timestamp) VALUES (${Database.connection.escape(id)}, ${Database.connection.escape(request.user.id)}, ${Database.connection.escape(Date.now())})`);
    
    fs.writeFileSync(global.config.paths.activities + `${id}.json`, body);
    
    return { success: true, content: id };
});
