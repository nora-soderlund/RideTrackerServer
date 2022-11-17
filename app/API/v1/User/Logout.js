import { v4 as uuidv4 } from "uuid";

import Server from "./../../../Server.js";
import Database from "./../../../Database.js";

Server.on("POST", "/api/v1/user/logout", { authenticated: true, parameters: [ "token" ] }, async (request, response, parameters) => {
    const row = await Database.querySingleAsync(`SELECT * FROM user_tokens WHERE id = ${Database.connection.escape(parameters.token)} LIMIT 1`);

    if(!row)
        return { success: false };

    Database.queryAsync(`DELETE FROM user_tokens WHERE id = ${Database.connection.escape(parameters.token)}`);

    return { success: true };
});
