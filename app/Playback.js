import Server from "./Server.js";

Server.on("GET", "/playback", async (request, response, parameters) => {
    return "<h1>playback!</h1>";
}, [ "activity" ], "text/html");
