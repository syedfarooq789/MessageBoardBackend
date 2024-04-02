import { Test, TestingModule } from '@nestjs/testing';
import { ChannelResolver } from './channel.resolver';
import { ChannelService } from '../service';
import { Channel } from '../model';
import { Result } from '../../common';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { ModuleRef } from '@nestjs/core';

describe('ChannelResolver', () => {
  let resolver: ChannelResolver;
  let channelService: ChannelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RedisModule.forRoot({})],
      providers: [
        ChannelResolver,
        ChannelService,
        {
          provide: ModuleRef,
          useValue: {
            resolve: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<ChannelResolver>(ChannelResolver);
    channelService = module.get<ChannelService>(ChannelService);
  });

  it('should return an array of channels', async () => {
    const channels: Channel[] = [
      { id: '1', name: 'Channel 1' },
      { id: '2', name: 'Channel 2' },
    ];
    jest
      .spyOn(channelService, 'getAllChannels')
      .mockResolvedValue(new Result(channels));

    const result = await resolver.getAllChannels();

    expect(result).toEqual(channels);
  });

  it('should create new channel', async () => {
    const channel: Channel = { id: '1', name: 'Channel 1' };
    jest
      .spyOn(channelService, 'createChannel')
      .mockResolvedValue(new Result(channel));

    const result = await resolver.createChannel('');

    expect(result).toEqual(channel);
  });
});
