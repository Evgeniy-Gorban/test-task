import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CommentsModule } from './comments/comments.module';
import { CaptchaModule } from './captcha/captcha.module';
import { LoggerModule } from './logger/logger.module';
import { UploadModule } from './upload/upload.module';
import * as redisStore from 'cache-manager-ioredis';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    CommentsModule,
    CaptchaModule,
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        host: configService.getOrThrow<string>('REDIS_HOST'),
        port: configService.getOrThrow<number>('REDIS_PORT'),
        password: configService.getOrThrow<string>('REDIS_PASSWORD'),
        ttl: 60 * 5,
      }),
    }),
    LoggerModule,
    UploadModule,
  ],
})
export class AppModule {}
