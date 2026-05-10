import cors from "@fastify/cors";
import Fastify from "fastify";
import env from "./configs/env";
import urlRoutes from "./routes/api";

export async function buildApp() {
  const app = Fastify({
    trustProxy: env.TRUST_PROXY,
  });

  if (env.CORS_ENABLED) {
    await app.register(cors, {
      origin: true,
    });
  }

  await app.register(urlRoutes);

  return app;
}
