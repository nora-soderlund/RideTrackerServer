import { v4 as uuidv4 } from "uuid";

import Server from "./../../../Server.js";
import Database from "./../../../Database.js";

Server.on("POST", "/api/v1/user/logout", async (request, response, parameters) => {
    const rows = await Database.queryAsync(`SELECT * FROM user_tokens WHERE id = ${Database.connection.escape(parameters.token)} LIMIT 1`);

    if(rows.length == 0)
        return { success: false, content: "Authentication failed!" };

    Database.queryAsync(`DELETE FROM user_tokens WHERE id = ${Database.connection.escape(parameters.token)}`);

    return { success: true };
}, [ "token" ]);
