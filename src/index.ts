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
    host: "192.168.1.178"
};

console.log("Server is starting...");

fastify.addHook("onSend", (request: FastifyRequest, reply: FastifyReply, payload: RequestPayload, done: DoneFuncWithErrOrRes) => {
    setTimeout(() => {
        done(null, payload);
    }, 1000);
});

import "./routes";

fastify.listen(fastifyOptions, (error: string, address: string) => {
    if (error) {
        console.error("Failed to start the server", error);

        return process.exit(-1);
    }

    console.log("Server is now started at", address);
});
