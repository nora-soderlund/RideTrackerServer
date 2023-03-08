import Fastify from "fastify";
import Container from "../container";
import { activityHandler } from "../controllers/activity";

const fastify = Container.resolve(typeof Fastify);

fastify.get("/activity/:id", activityHandler);
