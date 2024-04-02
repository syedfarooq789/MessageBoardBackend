import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';

@Module({
  imports: [
    RedisModule.forRoot({
      config: {
        host: 'redis',
        port: 6379,
      },
    }),
  ],
  providers: [],
  exports: [RedisModule],
})
export class DatabaseModule {}
