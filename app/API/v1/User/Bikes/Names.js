import Server from "./../../../../Server.js";
import Database from "./../../../../Database.js";

Server.on("GET", "/api/v1/user/bikes/names", { authenticated: true }, async (request, response, parameters) => {
    const rows = await Database.queryAsync(`SELECT id, name, brand, model, year FROM bikes WHERE user = ${Database.connection.escape(request.user.id)}`);

    let bikes = [];

    for(let index = 0; index < rows.length; index++) {
        const row = await Database.querySingleAsync(`SELECT COUNT(id) AS rides FROM activities WHERE bike = ${Database.connection.escape(rows[index].id)}`);

        bikes.push({
            id: rows[index].id,
            name: (rows[index].name)?(rows[index].name):(([ rows[index].brand, rows[index].model, rows[index].year ]).join(" ")),
            rides: row.rides
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
});
