import fs from "fs";
import { v4 as uuidv4 } from "uuid";

import Server from "./../../../Server.js";
import Database from "./../../../Database.js";

Server.on("POST", "/api/v1/user/avatar", async (request, response, body) => {
    if(request.user.guest)
        return { success: false };

    await Database.queryAsync(`UPDATE users SET avatar = ${Database.connection.escape(body.image)} WHERE id = ${Database.connection.escape(request.user.id)}`);
    
    return { success: true, content: body.image };
});
