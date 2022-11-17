import Server from "./../../../Server.js";
import Database from "./../../../Database.js";

Server.on("GET", "/api/v1/user/bikes", { parameters: [ "user" ] }, async (request, response, parameters) => {
    const rows = await Database.queryAsync(`SELECT id FROM bikes WHERE user = ${Database.connection.escape(parameters.user)}`);

    let bikes = [];

    for(let index = 0; index < rows.length; index++) {
        const activities = await Database.queryAsync(`SELECT COUNT(id) AS rides FROM activities WHERE bike = ${Database.connection.escape(rows[index].id)}`);

        bikes.push({
            id: rows[index].id,
            rides: activities[0].rides
        });
    }

    return {
        success: true,
        content: bikes.sort((a, b) => b.rides - a.rides).map((bike) => bike.id)
    };
});
