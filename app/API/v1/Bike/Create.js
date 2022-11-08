
import { v4 as uuidv4 } from "uuid";

import Server from "./../../../Server.js";
import Database from "./../../../Database.js";

Server.on("POST", "/api/bike/create", async (request, response, body) => {
    if(request.user.guest)
        return { success: false };

    const id = uuidv4();

    await Database.queryAsync(`INSERT INTO bikes (id, user, image, name, brand, model, year, timestamp) VALUES (${Database.connection.escape(id)}, ${Database.connection.escape(request.user.id)}, ${Database.connection.escape(body.image)}, ${Database.connection.escape(body.name)}, ${Database.connection.escape(body.brand)}, ${Database.connection.escape(body.model)}, ${Database.connection.escape(body.year)}, ${Database.connection.escape(Date.now())})`);
    
    return { success: true, content: id };
}, [ "name", "brand", "model", "year", "image" ]);
