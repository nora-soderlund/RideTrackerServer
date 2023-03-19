import { config } from "dotenv";
config({ path: ".env" });

import Fastify, { DoneFuncWithErrOrRes, FastifyReply, FastifyRequest, RequestPayload } from "fastify";
import Container from "./container";
import { Database } from "./services/database";

Container.register(Database, new Database({
    connectionLimit: 10,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}));

const fastify = Container.register(typeof Fastify, Fastify());

const fastifyOptions = {
    port: process.env.PORT,
    host: process.env.HOST
};

console.log("Server is starting...");

fastify.addHook("onRequest", async (request: FastifyRequest, reply: FastifyReply) => {
    if(!request.routerPath.startsWith("/guest/")) {
        if(!request.headers.authorization)
            throw new Error("Authorization header missing.");

        console.log(request.headers.authorization);

        const userKey = await getUserKeyById(request.headers.authorization);

        console.log(userKey);

        if(!userKey)
            throw new Error("Authorization key is invalid.");
    }
});

fastify.addHook("onSend", (request: FastifyRequest, reply: FastifyReply, payload: RequestPayload, done: DoneFuncWithErrOrRes) => {
    setTimeout(() => {
        console.log("sending " + request.routerPath);

        done(null, payload);
    }, 1000);
});

import "./routes";
import { getUserKeyById } from "./models/users/keys";

fastify.listen(fastifyOptions, (error: string, address: string) => {
    if (error) {
        console.error("Failed to start the server", error);

        return process.exit(-1);
    }

    console.log("Server is now started at", address);
});
