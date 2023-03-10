import Fastify from "fastify";
import Container from "../container";
import { authenticateUserHandler, loginUserHandler, registerUserHandler, userHandler } from "../controllers/user";

const fastify = Container.resolve(typeof Fastify);

fastify.get("/user/:id", userHandler);
