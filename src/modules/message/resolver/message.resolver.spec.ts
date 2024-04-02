import { Test, TestingModule } from '@nestjs/testing';
import { MessageResolver } from './message.resolver';
import { MessageService } from '../service';
import { Message } from '../model';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { ModuleRef } from '@nestjs/core';
import { Result } from '../../common';

describe('MessageResolver', () => {
  let resolver: MessageResolver;
  let messageService: MessageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RedisModule.forRoot({})],
      providers: [
        MessageResolver,
        MessageService,
        {
          provide: ModuleRef,
          useValue: {
            resolve: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<MessageResolver>(MessageResolver);
    messageService = module.get<MessageService>(MessageService);
  });

  it('should add a message to a channel', async () => {
    const channelId = '1';
    const messageId = '1';
    const content = 'Test message';

    const message: Message = { id: messageId, content };
    jest
      .spyOn(messageService, 'createMessage')
      .mockResolvedValue(new Result(message));

    const result = await resolver.createMessage(channelId, content);

    expect(result).toEqual(message);
  });

  it('should return messages for a channel', async () => {
    const channelId = '1';
    const messages: Message[] = [
      { id: '1', content: 'Message 1' },
      { id: '2', content: 'Message 2' },
    ];
    jest
      .spyOn(messageService, 'getChannelMessages')
      .mockResolvedValue(new Result(messages));
    const result = await resolver.getChannelMessages(channelId);
    expect(result).toEqual(messages);
  });
});
