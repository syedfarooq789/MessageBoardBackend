import { Injectable, HttpStatus } from '@nestjs/common';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { v4 as uuidv4 } from 'uuid';
import { Result, Error } from '../../common';

@Injectable()
export class MessageService {
  constructor(private readonly redisService: RedisService) {}

  async getChannelMessages(channelId: string) {
    try {
      const redisClient = await this.redisService.getClient();
      const messages = await redisClient.lrange(
        `channel:${channelId}:messages`,
        0,
        -1,
      );
      return new Result(messages.map((message) => JSON.parse(message)));
    } catch (error) {
      return new Error(HttpStatus.FORBIDDEN, error as string);
    }
  }

  async createMessage(channelId: string, content: string) {
    try {
      const messageId = uuidv4();
      const message = JSON.stringify({ id: messageId, content });
      const client = await this.redisService.getClient();
      await client.rpush(`channel:${channelId}:messages`, message);
      return new Result({
        id: messageId,
        content,
      });
    } catch (error) {
      return new Error(HttpStatus.FORBIDDEN, error as string);
    }
  }
}
