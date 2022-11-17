import Server from "./../../Server.js";

Server.on("GET", "/api/v1/ping", { content: "text/html" }, async (request, response) => {
    return "pong!";
});
