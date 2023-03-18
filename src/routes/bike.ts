import Fastify from "fastify";
import Container from "../container";
import { bikeHandler, userBikesHandler } from "../controllers/bike";

const fastify = Container.resolve(typeof Fastify);

fastify.get("/bikes", userBikesHandler);
fastify.get("/bike/:id", bikeHandler);
