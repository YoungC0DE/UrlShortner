import rateLimit from "@fastify/rate-limit";
import { FastifyInstance } from "fastify";

import env from "../configs/env";
import {
  createShortUrlController,
  redirectController,
} from "../http/controllers/url.controller";

async function urlRoutes(app: FastifyInstance) {
  await app.register(async function shortenScope(f) {
    await f.register(rateLimit, {
      max: env.RATE_LIMIT_MAX,
      timeWindow: env.RATE_LIMIT_TIME_WINDOW_MS,
      errorResponseBuilder: (_request, context) => ({
        error: "Too many requests",
        message:
          "Too many shorten requests from this client. Try again later.",
        retryAfter: context.after,
      }),
    });

    f.post("/shorten", createShortUrlController);
  });

  app.get("/:code", redirectController);
}

export default urlRoutes;