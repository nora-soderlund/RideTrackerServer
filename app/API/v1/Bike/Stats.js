import Server from "./../../../Server.js";
import Database from "./../../../Database.js";

Server.on("GET", "/api/v1/bike/stats", { parameters: [ "id" ] }, async (request, response, parameters) => {
    const bike = await Database.querySingleAsync(`SELECT * FROM bikes WHERE id = ${Database.connection.escape(parameters.id)} LIMIT 1`);

    if(!bike)
        return { success: false };

    const row = await Database.querySingleAsync(`SELECT COUNT(id) AS rides, SUM(\`distance\`) AS \`distance\`, SUM(elevation) AS elevation FROM activities WHERE bike = ${Database.connection.escape(bike.id)}`);
    
    if(!row)
        return { success: false };

    return {
        success: true,
        content: {
            rides: row.rides,
            distance: Math.round(row.distance) ?? 0,
            elevation: Math.round(row.elevation) ?? 0
        }
    };
});
