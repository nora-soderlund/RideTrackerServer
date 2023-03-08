import { FastifyReply, FastifyRequest } from "fastify";
import { getFeed } from "../models/feed";

export async function feedHandler(request: FastifyRequest, reply: FastifyReply) {
    return await getFeed();
};
