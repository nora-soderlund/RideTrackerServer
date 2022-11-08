import Server from "./../../Server.js";
import Database from "./../../Database.js";

// this only sends the ids of the activities to show to allow for the
// client to cache the activities it has already requested, if any.
Server.on("GET", "/api/v1/feed", async (request, response) => {
    const rows = await Database.queryAsync("SELECT id FROM activities ORDER BY timestamp DESC");

    return {
        success: true,
        content: rows.map((row) => row.id)
    };
});
