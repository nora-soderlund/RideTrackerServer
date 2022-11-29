import Server from "./../../Server.js";
import Database from "./../../Database.js";
import Manifest from "../../Manifest.js";

Server.on("GET", "/api/v1/manifest", {}, async (request, response) => {
    return Manifest.structures;
});
