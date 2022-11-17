import { v4 as uuidv4 } from "uuid";

import Server from "./../../../Server.js";
import Database from "./../../../Database.js";

Server.on("POST", "/api/v1/route/create", { authenticated: true, parameters: [ "bdirections" ], optionalParameters: [ "name" ] }, async (request, response, body) => {
    const row = await Database.querySingleAsync(`SELECT * FROM directions WHERE id = ${Database.connection.escape(body.directions)}`);

    if(!row)
        return { success: false };

    const id = uuidv4();

    await Database.queryAsync(`INSERT INTO routes (id, user, name, directions, timestamp) VALUES (${Database.connection.escape(id)}, ${Database.connection.escape(request.user.id)}, ${Database.connection.escape(body.name)}, ${Database.connection.escape(row.id)}, ${Database.connection.escape(Date.now())})`);
    
    return { success: true, content: id };
});
