import fs from "fs";
import { v4 as uuidv4 } from "uuid";

import Server from "./../../../Server.js";
import Database from "./../../../Database.js";

import global from "./../../../../global.js";

Server.on("PUT", "/api/v1/user/avatar", { authenticated: true }, async (request, response, body) => {
    const id = uuidv4() + ".png";

    fs.writeFileSync(global.config.paths.avatars + "/" + id, body, "base64");

    await Database.queryAsync(`UPDATE users SET avatar = ${Database.connection.escape(id)} WHERE id = ${Database.connection.escape(request.user.id)}`);
    
    return { success: true, content: id };
});
