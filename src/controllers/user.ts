import { FastifyReply, FastifyRequest } from "fastify";
import { getUserById } from "../models/users";

export async function userHandler(request: FastifyRequest, reply: FastifyReply) {
    const user = await getUserById((request.params as any).id);

    if(user === null)
        return { error: "User doesn't exist." };

    return user;
};
