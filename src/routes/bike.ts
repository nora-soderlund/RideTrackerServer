import Fastify from "fastify";
import Container from "../container";
import { bikeHandler } from "../controllers/bike";

const fastify = Container.resolve(typeof Fastify);

fastify.get("/bike/:id", bikeHandler);
