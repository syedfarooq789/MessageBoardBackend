import { Injectable, HttpStatus } from '@nestjs/common';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { Channel } from '../model';
import { v4 as uuidv4 } from 'uuid';
import { Result, Error } from '../../common';

@Injectable()
export class ChannelService {
  constructor(private readonly redisService: RedisService) {}

  async getAllChannels() {
    try {
      const redisClient = this.redisService.getClient();
      const channelIds = await redisClient.hkeys('channels');
      const channels: Channel[] = [];

      for (const channelId of channelIds) {
        const channelName = await redisClient.hget('channels', channelId);
        if (channelName) {
          channels.push({ id: channelId, name: channelName });
        }
      }
      return new Result(channels);
    } catch (error) {
      return new Error(HttpStatus.FORBIDDEN, error as string);
    }
  }

  async createChannel(name: string) {
    try {
      if (name === '') {
        return new Error(HttpStatus.FORBIDDEN, 'Channel should have a name');
      }
      const client = await this.redisService.getClient();
      const id = uuidv4();
      await client.hset('channels', id, name);
      return new Result({ id, name });
    } catch (error) {
      return new Error(HttpStatus.FORBIDDEN, error as string);
    }
  }
}
