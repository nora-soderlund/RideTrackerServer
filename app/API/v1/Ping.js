import Server from "./../../Server.js";

Server.on("GET", "/api/v1/v1/ping", async (request, response) => {
    return "pong!";
}, null, "text/html");
