import Fastify from "fastify";
import Container from "../container";
import { feedHandler } from "../controllers/feed";

const fastify = Container.resolve(typeof Fastify);

fastify.get("/feed", feedHandler);
