import { v4 as uuidv4 } from "uuid";

import Server from "./../../../Server.js";
import Database from "./../../../Database.js";

Server.on("POST", "/api/v1/user/authenticate", { parameters: [ "token" ] }, async (request, response, parameters) => {
    const row = await Database.querySingleAsync(`SELECT * FROM user_tokens WHERE id = ${Database.connection.escape(parameters.token)} LIMIT 1`);

    if(!row)
        return { success: false };

    Database.queryAsync(`DELETE FROM user_tokens WHERE id = ${Database.connection.escape(parameters.token)}`);

    if(row.deleted)
        return { success: false };

    const newToken = uuidv4();
    await Database.queryAsync(`INSERT INTO user_tokens (id, user) VALUES (${Database.connection.escape(newToken)}, ${Database.connection.escape(row.user)})`);

    return { success: true, content: { id: row.user, token: newToken } };
});
