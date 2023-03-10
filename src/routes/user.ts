import Fastify from "fastify";
import Container from "../container";
import { authenticateUserHandler, loginUserHandler, registerUserHandler, userHandler } from "../controllers/user";

const fastify = Container.resolve(typeof Fastify);

fastify.get("/user/:id", userHandler);

fastify.post("/user/login", {
    schema: {
        body: {
            type: "object",
            properties: {
                email: { type: "string" },
                password: { type: "string" }
            },
            additionalProperties: false,
            required: [ "email", "password" ]
        }
    }
}, loginUserHandler);

fastify.post("/user/register", {
    schema: {
        body: {
            type: "object",
            properties: {
                firstname: { type: "string" },
                lastname: { type: "string" },
                email: { type: "string" },
                password: { type: "string" }
            },
            additionalProperties: false,
            required: [ "firstname", "lastname", "email", "password" ]
        }
    }
}, registerUserHandler);

fastify.post("/user/authenticate", {
    schema: {
        body: {
            type: "object",
            properties: {
                key: { type: "string" }
            },
            additionalProperties: false,
            required: [ "key" ]
        }
    }
}, authenticateUserHandler);
