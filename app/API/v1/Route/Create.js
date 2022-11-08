
import { v4 as uuidv4 } from "uuid";

import Server from "./../../../Server.js";
import Database from "./../../../Database.js";

Server.on("POST", "/api/v1/route/create", async (request, response, body) => {
    if(request.user.guest)
        return { success: false };

    const rows = await Database.queryAsync(`SELECT * FROM directions WHERE id = ${Database.connection.escape(body.directions)}`);

    if(!rows.length)
        return { success: false };

    const row = rows[0];

    const id = uuidv4();

    await Database.queryAsync(`INSERT INTO routes (id, user, name, directions, timestamp) VALUES (${Database.connection.escape(id)}, ${Database.connection.escape(request.user.id)}, ${Database.connection.escape(body.name)}, ${Database.connection.escape(row.id)}, ${Database.connection.escape(Date.now())})`);
    
    return { success: true, content: id };
}, [ "name", "directions" ]);
