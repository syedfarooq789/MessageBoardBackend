import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ChannelService } from '../service';
import { Channel } from '../model';
import { Result } from '../../common';
import { HttpException, HttpStatus } from '@nestjs/common';

@Resolver('Channel')
export class ChannelResolver {
  constructor(private readonly channelService: ChannelService) {}

  @Query('getAllChannels')
  async getAllChannels(): Promise<Channel[]> {
    const result = await this.channelService.getAllChannels();
    if (result instanceof Result) {
      return result.data;
    }
    throw new HttpException(result.message, HttpStatus.FORBIDDEN);
  }

  @Mutation('createChannel')
  async createChannel(@Args('name') name: string): Promise<Channel> {
    const result = await this.channelService.createChannel(name);
    if (result instanceof Result) {
      return result.data;
    }
    throw new HttpException(result.message, HttpStatus.FORBIDDEN);
  }
}
