import { FastifyReply, FastifyRequest } from "fastify";
import { getUserById } from "../models/users";

export async function pingHandler(request: FastifyRequest, reply: FastifyReply) {
    const user = await getUserById("02ff77a5-5c6b-44f5-9589-699f7793025c");

    console.log(user);

    //reply.send({ params: request.query });

    return {
        ping: "pong"
    };
};
