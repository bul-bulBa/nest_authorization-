import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config'
import cookieParser from 'cookie-parser'
import { ValidationPipe } from '@nestjs/common';
import { ms } from './libs/common/utils/ms.util';
import { parseBoolean } from './libs/common/utils/parse-bool.util';

import * as sessionImport from 'express-session';
const session =
  (sessionImport as any).default ?? sessionImport;

import RedisStore  from 'connect-redis';
import Redis from 'ioredis';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService)

  const redisClient = new Redis({
    host: config.getOrThrow<string>('SESSION_DOMAIN'),
    port: config.getOrThrow<number>('REDIS_PORT')
  })

  const redisStore = new RedisStore({
    client: redisClient,
    prefix: config.getOrThrow<string>('SESSION_FOLDER')
  })

  app.use(cookieParser(config.getOrThrow('COOKIES_SECRET')))

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true
    })
  )

  app.use(
    session({
      secret: config.getOrThrow<string>('SESSION_SECRET'),
      name: config.getOrThrow<string>('SESSION_NAME'),
      resave: true,
      saveUninitialized: false,
      cookie: {
        domain: config.getOrThrow<string>('SESSION_DOMAIN'),
        maxAge: ms(config.getOrThrow<string>('SESSION_MAX_AGE')),
        httpOnly: parseBoolean(
          config.getOrThrow<string>('SESSION_HTTP_ONLY')
        ),
        secure: parseBoolean(
          config.getOrThrow<string>('SESSION_SECURE')
        ),
        sameSite: 'lax'
      },
      store: redisStore
    })
  )

  app.enableCors({
    origin: config.getOrThrow<string>('ALLOWED_ORIGIN'),
    credentials: true,
    exposedHeaders: ['set-cookie']
  })

  await app.listen(config.getOrThrow<number>('APPLICATION_PORT') ?? 3000);
}
bootstrap();
