import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { MessageService } from '../service';
import { Message } from '../model';
import { Result } from '../../common';
import { HttpException, HttpStatus } from '@nestjs/common';

@Resolver('Message')
export class MessageResolver {
  constructor(private readonly messageService: MessageService) {}

  @Query('getChannelMessages')
  async getChannelMessages(
    @Args('channelId') channelId: string,
  ): Promise<string[]> {
    const result = await this.messageService.getChannelMessages(channelId);
    if (result instanceof Result) {
      return result.data;
    }
    throw new HttpException(result.message, HttpStatus.FORBIDDEN);
  }

  @Mutation('createMessage')
  async createMessage(
    @Args('channelId') channelId: string,
    @Args('content') content: string,
  ): Promise<Message> {
    const result = await this.messageService.createMessage(channelId, content);
    if (result instanceof Result) {
      return result.data;
    }
    throw new HttpException(result.message, HttpStatus.FORBIDDEN);
  }
}
