import Server from "./../../../Server.js";
import Database from "./../../../Database.js";

Server.on("GET", "/api/user/activity", async (request, response, parameters) => {
    const activities = await Database.queryAsync(`SELECT id, timestamp FROM activities WHERE user = ${Database.connection.escape(parameters.user)} ORDER BY timestamp DESC`);
    const bikes = await Database.queryAsync(`SELECT id, timestamp FROM bikes WHERE user = ${Database.connection.escape(parameters.user)} ORDER BY timestamp DESC`);
    const comments = await Database.queryAsync(`SELECT id, timestamp FROM activity_comments WHERE user = ${Database.connection.escape(parameters.user)} ORDER BY timestamp DESC`);

    let result = [];

    result = result.concat(activities.map((activity) => {
        return {
            id: activity.id,
            timestamp: activity.timestamp,
            type: "activity"
        };
    }));

    result = result.concat(bikes.map((bike) => {
        return {
            id: bike.id,
            timestamp: bike.timestamp,
            type: "bike"
        };
    }));

    result = result.concat(comments.map((comment) => {
        return {
            id: comment.id,
            timestamp: comment.timestamp,
            type: "comment"
        };
    }));

    result = result.sort((a, b) => b.timestamp - a.timestamp);

    return {
        success: true,
        content: result
    };
}, [ "user" ]); 
