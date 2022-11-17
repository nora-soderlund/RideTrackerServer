import fs from "fs";
import { v4 as uuidv4 } from "uuid";

import Server from "../../../Server.js";
import Database from "../../../Database.js";

import global from "../../../../global.js";

Server.on("POST", "/api/v1/bike/image", { authenticated: true, parameters: [ "bike", "image" ] }, async (request, response, body) => {
    const row = await Database.queryAsync(`SELECT * FROM bikes WHERE id = ${Database.connection.escape(body.bike)}`);

    if(!row)
        return { success: false };

    if(row.user != request.user.id)
        return { success: false };

    const id = uuidv4() + ".png";

    fs.writeFileSync(global.config.paths.bikes + "/" + id, body.image, "base64");

    await Database.queryAsync(`UPDATE bikes SET image = ${Database.connection.escape(id)} WHERE id = ${Database.connection.escape(row.id)}`);
    
    return { success: true, content: id };
});
