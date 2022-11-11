import Server from "./../../../Server.js";
import Database from "./../../../Database.js";

Server.on("GET", "/api/v1/user/bikes/names", async (request, response, parameters) => {
    const rows = await Database.queryAsync(`SELECT id, name, brand, model, year FROM bikes WHERE user = ${Database.connection.escape(parameters.user)}`);

    let bikes = [];

    for(let index = 0; index < rows.length; index++) {
        const activities = await Database.queryAsync(`SELECT COUNT(id) AS rides FROM activities WHERE bike = ${Database.connection.escape(rows[index].id)}`);

        bikes.push({
            id: rows[index].id,
            name: (rows[index].name)?(rows[index].name):(([ rows[index].brand, rows[index].model, rows[index].year ]).join(" ")),
            rides: activities[0].rides
        });
    }

    return {
        success: true,
        content: bikes.sort((a, b) => b.rides - a.rides).map((bike) => {
            return {
                id: bike.id,
                name: bike.name
            };
        })
    };
}, [ "user" ]);
