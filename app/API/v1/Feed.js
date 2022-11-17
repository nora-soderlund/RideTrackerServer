import Server from "./../../Server.js";
import Database from "./../../Database.js";

function getSortQuery(sort) {
    switch(sort) {
        case "oldest":
            return "ORDER BY timestamp ASC";
            
        case "distance":
            return "ORDER BY distance DESC";
            
        case "elevation":
            return "ORDER BY elevation DESC";
            
        case "speed":
            return "ORDER BY speed DESC";

        default:
        case "newest":
            return "ORDER BY timestamp DESC";
    }
};

function getTimeframeQuery(timeframe) {
    const date = new Date(Date.now());

    switch(timeframe) {
        case "last_week":
            return `WHERE timestamp > ${date.setDate(date.getDate() - 7)}`;
            
        case "last_month":
            return `WHERE timestamp > ${date.setMonth(date.getMonth() - 1)}`;
            
        case "last_year":
            return `WHERE timestamp > ${date.setFullYear(date.getFullYear() - 1)}`;
            
        default:
        case "all_time":
            return ``;
    }
};

// this only sends the ids of the activities to show to allow for the
// client to cache the activities it has already requested, if any.
Server.on("GET", "/api/v1/feed", async (request, response) => {
    const rows = await Database.queryAsync(`SELECT id FROM activities ORDER BY timestamp DESC`);

    return {
        success: true,
        content: rows.map((row) => row.id)
    };
});

Server.on("POST", "/api/v1/feed", { parameters: [ "filter" ] }, async (request, response, body) => {
    if(!body.filter) {
        const rows = await Database.queryAsync("SELECT id FROM activities ORDER BY timestamp DESC");

        return {
            success: true,
            content: rows.map((row) => row.id)
        };
    }

    const sort = body.filter.sort ?? "newest";
    const timeframe = body.filter.timeframe ?? "all_time";

    const rows = await Database.queryAsync(`SELECT id FROM activities ${getTimeframeQuery(timeframe)} ${getSortQuery(sort)}`);

    return {
        success: true,
        content: rows.map((row) => row.id)
    };
});
