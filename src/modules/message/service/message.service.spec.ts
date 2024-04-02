import { Test, TestingModule } from '@nestjs/testing';
import { MessageService } from './message.service';
import { RedisService } from '@liaoliaots/nestjs-redis';

jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('generated-uuid'),
}));

describe('MessageService', () => {
  let messageService: MessageService;
  const mockRedisClient = {
    lrange: jest.fn().mockResolvedValue(['{"id":"messageId1","content":"Message 1"}', 
    '{"id":"messageId2","content":"Message 2"}']),
    rpush: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageService,
        {
          provide: RedisService,
          useValue: {
            getClient: jest.fn(() => mockRedisClient),
          },
        },
      ],
    }).compile();

    messageService = module.get<MessageService>(MessageService);
  });

  it('should retrieve all messages and construct an array of Message objects', async () => {
    const channelId = 'channelId1';

    const result = await messageService.getChannelMessages(channelId);
    expect(mockRedisClient.lrange).toHaveBeenCalledWith(
      `channel:${channelId}:messages`,
      0,
      -1,
    );

    expect(result).toEqual({
      data: [
        { id: 'messageId1', content: 'Message 1' },
        { id: 'messageId2', content: 'Message 2' },
      ],
    });
  });

  it('should set a message in the Redis database and return the expected result', async () => {
    const channelId = 'channelId1';
    const content = 'Test message';
    const result = await messageService.createMessage(channelId, content);
    const expectResult = { id: 'generated-uuid', content: 'Test message' };
    expect(mockRedisClient.rpush).toHaveBeenCalledWith(
      `channel:${channelId}:messages`,
      JSON.stringify(expectResult),
    );
    expect(result).toEqual({
      data: {
        id: 'generated-uuid',
        content: 'Test message',
      },
    });
  });
});
