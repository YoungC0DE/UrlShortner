import { buildApp } from "./app";
import env from "./configs/env";
import { connectMongo } from "./configs/mongo";

async function bootstrap() {
  try {
    await connectMongo();

    const app = await buildApp();

    await app.listen({
      port: env.PORT,
      host: "0.0.0.0",
    });

    console.log(
      `Server running on port ${env.PORT}`
    );
  } catch (error) {
    console.error(error);

    process.exit(1);
  }
}

bootstrap();