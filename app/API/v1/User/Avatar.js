import fs from "fs";
import { v4 as uuidv4 } from "uuid";

import Server from "./../../../Server.js";
import Database from "./../../../Database.js";

Server.on("PUT", "/api/user/avatar", async (request, response, body) => {
    if(request.user.guest)
        return { success: false };

    const id = uuidv4() + ".png";

    fs.writeFileSync("./app/public/avatars/" + id, body, "base64");

    await Database.queryAsync(`UPDATE users SET avatar = ${Database.connection.escape(id)} WHERE id = ${Database.connection.escape(request.user.id)}`);
    
    return { success: true, content: id };
});
