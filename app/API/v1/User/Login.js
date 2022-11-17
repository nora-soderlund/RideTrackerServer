import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

import Server from "./../../../Server.js";
import Database from "./../../../Database.js";

Server.on("POST", "/api/v1/user/login", { authenticated: false, parameters: [ "email", "password" ] }, async (request, response, parameters) => {
    const row = await Database.querySingleAsync(`SELECT * FROM users WHERE email = ${Database.connection.escape(parameters.email)} LIMIT 1`);
    
    if(!row)
        return { success: false, content: "This e-mail address isn't registered to any users!" };

    const match = await bcrypt.compare(parameters.password, row.password);
    
    if(!match)
        return { success: false, content: "Your credentials does not match!" };

    if(row.deleted)
        return { success: false, content: "Your account deletion is being processed!" };

    const token = uuidv4();

    await Database.queryAsync(`INSERT INTO user_tokens (id, user) VALUES (${Database.connection.escape(token)}, ${Database.connection.escape(row.id)})`);

    return { success: true, content: token };
});
