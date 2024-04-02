import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ChannelInitializationService implements OnApplicationBootstrap {
  constructor(private readonly redisService: RedisService) {}

  async onApplicationBootstrap() {
    const client = await this.redisService.getClient();
    const channels = ['RadioChannel', 'LaptopChannel', 'FinlandChannel'];

    for (const channelId of channels) {
      const id = uuidv4();
      await client.hset('channels', id, channelId);
    }
  }
}
