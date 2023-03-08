import { FastifyReply, FastifyRequest } from "fastify";
import { getBikeById } from "../models/bikes";
import { getUserById } from "../models/users";

export async function bikeHandler(request: FastifyRequest, reply: FastifyReply) {
    const bike = await getBikeById((request.params as any).id);

    if(bike === null)
        return { error: "Bike doesn't exist." };

    return bike;
};
