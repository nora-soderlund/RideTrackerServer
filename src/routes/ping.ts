import Fastify from "fastify";
import Container from "../container";
import { pingHandler } from "../controllers/ping";

const fastify = Container.resolve(typeof Fastify);

fastify.get("/ping", {
    schema: {
        querystring: {
            type: "object",
            properties: {
                validation: { type: "boolean" }
            },
            additionalProperties: false,
            required: [ "validation" ]
        }
    }
}, pingHandler);
