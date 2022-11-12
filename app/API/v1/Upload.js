import fs from "fs";
import { v4 as uuidv4 } from "uuid";

import Server from "./../../Server.js";
import Database from "./../../Database.js";

import global from "./../../../global.js";

Server.on("PUT", "/api/v1/upload", async (request, response, body) => {
    if(request.user.guest)
        return { success: false };

    const path = "/uploads" + "/" + request.user.id + "/";

    if(!fs.existsSync(global.config.paths.public + path))
        fs.mkdirSync(global.config.paths.public + path);

    const id = uuidv4();

    const file = path + id + ".png";

    await Database.queryAsync(`INSERT INTO uploads (id, user, timestamp) VALUES (${Database.connection.escape(id)}, ${Database.connection.escape(request.user.id)}, ${Database.connection.escape(Date.now())})`);

    fs.writeFileSync(global.config.paths.public + file, body, "base64");
    
    return { success: true, content: file };
});
