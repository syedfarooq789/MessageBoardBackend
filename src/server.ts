import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { ApplicationModule } from './modules/app.module';

/**
 * These are API defaults that can be changed using environment variables,
 * it is not required to change them (see the `.env.example` file)
 */
const API_DEFAULT_PORT = 3000;
const API_DEFAULT_PREFIX = '/api/v1/';
const API_DEFAULT_HOST = '0.0.0.0';

/**
 * Build & bootstrap the NestJS API.
 * This method is the starting point of the API; it registers the application
 * module and registers essential components such as the logger and request
 * parsing middleware.
 */
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestFastifyApplication>(
    ApplicationModule,
    new FastifyAdapter(),
  );

  app.setGlobalPrefix(process.env.API_PREFIX || API_DEFAULT_PREFIX);

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  await app.listen(process.env.API_PORT || API_DEFAULT_PORT, API_DEFAULT_HOST);
}

/**
 * It is now time to turn the lights on!
 * Any major error that can not be handled by NestJS will be caught in the code
 * below. The default behavior is to display the error on stdout and quit.
 *
 * @todo It is often advised to enhance the code below with an exception-catching
 *       service for better error handling in production environments.
 */
bootstrap().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);

  const defaultExitCode = 1;
  process.exit(defaultExitCode);
});
