import { Module } from '@nestjs/common';
import { MessageService } from './service';
import { MessageResolver } from './resolver';
import { DatabaseModule } from '../database';
@Module({
  imports: [DatabaseModule],
  providers: [MessageResolver, MessageService],
  controllers: [],
  exports: [],
})
export class MessageModule {}
