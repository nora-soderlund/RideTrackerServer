import { FastifyReply, FastifyRequest } from "fastify";
import { getBikeById, getBikesByUser } from "../models/bikes";
import { getUserById } from "../models/users";
import { getUserKeyById } from "../models/users/keys";
import { getBikeSummary } from "../models/bikes/summary";

export async function bikeHandler(request: FastifyRequest, reply: FastifyReply) {
    const bike = await getBikeById((request.params as any).id);

    if(bike === null)
        return { error: "Bike doesn't exist." };

    return bike;
};

export async function userBikesHandler(request: FastifyRequest, reply: FastifyReply) {
    const userKey = await getUserKeyById(request.headers.authorization as string);

    if(!userKey)
        return { error: "can't happen" };

    const bikes = await getBikesByUser(userKey.user);

    return await Promise.all(bikes.map(async (bike) => {
        const bikeSummary = await getBikeSummary(bike);
        
        return {
            id: bike.id,
            name: bike.name,
            model: bike.model,
            image: bike.image,

            summary: bikeSummary && {
                rides: bikeSummary.rides,
                distance: bikeSummary.distance,
                elevation: bikeSummary.elevation
            }
        };
    }));
};
