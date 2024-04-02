import { Test, TestingModule } from '@nestjs/testing';
import { ChannelService } from './channel.service';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { Result } from '../../common';

jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('generated-uuid'),
}));

describe('ChannelService', () => {
  let channelService: ChannelService;
  let redisService: RedisService;
  const mockRedisClient = {
    hset: jest.fn(),
    hkeys: jest.fn().mockResolvedValue(['channelId1', 'channelId2']),
    hget: jest.fn().mockImplementation((hashKey: string, field: string) => {
      if (field === 'channelId1') {
        return 'Channel 1';
      } else if (field === 'channelId2') {
        return 'Channel 2';
      }
      return null;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChannelService,
        {
          provide: RedisService,
          useValue: {
            getClient: jest.fn(() => mockRedisClient),
          },
        },
      ],
    }).compile();

    channelService = module.get<ChannelService>(ChannelService);
    redisService = module.get<RedisService>(RedisService);
  });

  it('should be defined', () => {
    expect(channelService).toBeDefined();
  });

  it('should create a channel', async () => {
    const channelName = 'Test Channel';

    const redisClient = redisService.getClient();
    jest.spyOn(redisClient, 'hset').mockResolvedValue(1);

    const result = await channelService.createChannel(channelName);
    if (result instanceof Result) {
      expect(mockRedisClient.hset).toHaveBeenCalledWith(
        'channels',
        'generated-uuid',
        channelName,
      );
    }
  });

  it('should retrieve all channels and construct an array of Channel objects', async () => {
    const result = await channelService.getAllChannels();
    expect(mockRedisClient.hkeys).toHaveBeenCalledWith('channels');
    expect(mockRedisClient.hget).toHaveBeenCalledWith('channels', 'channelId1');
    expect(mockRedisClient.hget).toHaveBeenCalledWith('channels', 'channelId2');
    expect(result).toEqual({
      data: [
        { id: 'channelId1', name: 'Channel 1' },
        { id: 'channelId2', name: 'Channel 2' },
      ],
    });
  });
});
